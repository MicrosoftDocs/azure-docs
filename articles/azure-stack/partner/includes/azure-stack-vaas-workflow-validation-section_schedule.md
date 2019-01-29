---
 author: mattbriggs
 ms.service: azure-stack
 ms.topic: include
 ms.date: 11/26/2018
 ms.author: mabrigg
---

In the validation workflows, **scheduling** a test uses the workflow-level common parameters that you specified during workflow creation (see [Workflow common parameters for Azure Stack Validation as a Service](../azure-stack-vaas-parameters.md)). If any of test parameter values become invalid, you must resupply them as instructed in [Modify workflow parameters](../azure-stack-vaas-monitor-test.md#change-workflow-parameters).

> [!NOTE]
> Scheduling a validation test over an existing instance will create a new instance in place of the old instance in the portal. Logs for the old instance will be retained but are not accessible from the portal.  
Once a test has completed successfully, the **Schedule** action becomes disabled.

1. [!INCLUDE [azure-stack-vaas-workflow-step_select-agent](azure-stack-vaas-workflow-step_select-agent.md)]

1. Select **Schedule** from the context menu to open a prompt for scheduling the test instance.

1. Review the test parameters and then select **Submit** to schedule the test for execution.