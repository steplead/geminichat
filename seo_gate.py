#!/usr/bin/env python3
"""Deterministic SEO release gates.

Input is a JSON object. Missing fields are reported as WARN rather than
silently treated as healthy. This keeps the gate safe for automation.
"""
import argparse
import json
import sys


def gate(data):
    findings = []
    indexed = int(data.get("indexed_pages", 0))
    real_index_issues = int(data.get("real_not_indexed_pages", 0))
    discovered_stale = int(data.get("discovered_not_indexed_stale_pages", 0))
    exposed = int(data.get("pages_with_impressions", 0))
    important_changed = int(data.get("important_pages_changed", 0))
    gsc_growth = data.get("gsc_query_growth")
    period_weeks = int(data.get("stable_growth_weeks", 0))
    ranking_changed = bool(data.get("ranking_changed", True))
    low_ctr = bool(data.get("low_ctr", False))
    expected_gsc_warnings = bool(data.get("gsc_warnings_expected", True))

    if not expected_gsc_warnings and data.get("gsc_warnings"):
        findings.append(("BLOCK", "存在未确认的 GSC 提示；先判断是否符合预期，不要自动点击验证修复。"))
    if real_index_issues > indexed:
        findings.append(("BLOCK", "真实未收录问题页超过已收录页，暂停批量生产并核查质量/重复/内链。"))
    if discovered_stale > 0:
        findings.append(("BLOCK", "存在长期‘已发现-尚未编入索引’页面；暂停批量生产并下架低质或重复页。"))
    if exposed > 0 and important_changed == 0:
        findings.append(("INFO", "已有曝光页面不重复请求收录；仅新上线或重要改版页面可请求。"))
    if gsc_growth is not None and data.get("keyword_source") != "ahrefs_or_semrush":
        findings.append(("WARN", "词库使用 GSC 降级口径，不能据此单独卡住关 5。"))
    if period_weeks < 2:
        findings.append(("WARN", "稳定增长观察未达到默认 2 周阈值（该阈值可调）。"))
    if low_ctr and not ranking_changed:
        findings.append(("WARN", "CTR 低且排名未变：可小幅测试 Title，但不得把 CTR 低直接当作必改条件。"))
    if low_ctr and ranking_changed:
        findings.append(("INFO", "排名发生变化，优先处理排名原因，不先改 Title。"))
    if data.get("member_post_volume_rule"):
        findings.append(("WARN", "会员帖数量规则仅有标题口径，原帖校验前不得作为硬规则。"))
    return findings


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", nargs="?", help="JSON file; defaults to stdin")
    args = parser.parse_args()
    raw = open(args.input, encoding="utf-8").read() if args.input else sys.stdin.read()
    findings = gate(json.loads(raw))
    exit_code = 1 if any(level == "BLOCK" for level, _ in findings) else 0
    for level, message in findings:
        print(f"{level}: {message}")
    print("PASS: no blocking SEO gate detected" if exit_code == 0 else "BLOCKED: resolve blocking findings")
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
