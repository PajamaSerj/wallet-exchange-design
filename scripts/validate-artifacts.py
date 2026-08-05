#!/usr/bin/env python3
"""Basic scaffold and JSON checks; not a substitute for the final audit."""
from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "Wallet_Exchange_Project_Brief.md", "README.md",
    "docs/00_governance/acceptance-checklist.md",
    "docs/00_governance/requirements-register.md",
    "docs/00_governance/traceability-matrix.md",
    "docs/00_governance/assumptions-decisions.md",
    "docs/01_system-design/wallet-exchange-sdd.md",
    "docs/01_system-design/diagrams/README.md",
    "docs/02_ux/ux-spec.md", "docs/02_ux/prototype-link.md",
    "docs/02_ux/screenshots/README.md",
    "docs/03_scenarios/exchange-request.feature",
    "docs/04_api/openapi.json",
    "docs/05_prompt-log/prompt-log.md",
    "docs/06_qa/final-audit-report.md", "docs/06_qa/remediation-plan.md",
    "docs/06_qa/recheck-report.md", "docs/06_qa/final-conclusion.md",
    "prototype/index.html", "prototype/styles.css", "prototype/app.js"
]
JSON_FILES = [
    "docs/04_api/openapi.json",
    "docs/04_api/examples/create-request.json",
    "docs/04_api/examples/success-response.json",
    "docs/04_api/examples/error-responses.json"
]

def main() -> int:
    errors = [f"Missing: {p}" for p in REQUIRED if not (ROOT / p).is_file()]
    for relative in JSON_FILES:
        try:
            with (ROOT / relative).open(encoding="utf-8") as source:
                json.load(source)
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            errors.append(f"Invalid JSON {relative}: {exc}")
    if errors:
        print("Validation failed:")
        print("\n".join(f"- {e}" for e in errors))
        return 1
    print("Scaffold and basic JSON checks passed.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
