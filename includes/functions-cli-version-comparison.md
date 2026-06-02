There are two versions of `func.exe` used for local Azure Functions development:

| | [v4](../articles/azure-functions/functions-run-local.md) | [v5](../articles/azure-functions/functions-cli-develop-local.md) |
| --- | --- | --- |
| **API name** | [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md) | [Azure Functions CLI](../articles/azure-functions/functions-cli-develop-local.md) |
| **Support level** | General availability (GA) | Preview |
| **Supported hosting plans** | [All hosting plans](../articles/azure-functions/functions-scale.md) | [Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md) only |
| **Install footprint** | Full binary that includes all commands and capabilities for all native languages. | Small base install, plus workloads per-language and other features you add as needed. |
| **Use when...** | You need support for all hosting plans and development workflows. | When developing for the Flex Consumption plan (Linux-only) and you want a lightweight, workload-based experience. |
