There are two versions of `func.exe` used for local Azure Functions development:

| | [v4](../articles/azure-functions/functions-run-local.md) | [v5](../articles/azure-functions/functions-cli-develop-local.md) |
| --- | --- | --- |
| **API name** | [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md) | [Azure Functions CLI](../articles/azure-functions/functions-cli-develop-local.md) |
| **Support level** | General availability (GA) | Preview |
| **Install footprint** | Full binary that includes all commands and capabilities for all native languages. | Small base install, plus workloads per-language and other features you add as needed. The host ships as its own workload, so you get the latest host version without re-downloading the CLI. |
| **Use when...** | You need full GA support for all development workflows. | You want a lightweight, workload-based experience with new features like quickstart templates and profiles that keep your local environment in sync with your Azure hosting plan configuration. |
