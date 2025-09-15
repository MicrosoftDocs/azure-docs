---
title: "Azure Operator Nexus: Logs Disrupted After 48-hour Disconnection"
description: Learn how to troubleshoot log disruption Issue post a disconnection period of more than two days.
author: neilverse
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 09/11/2025
# ms.custom: template-include
---

# Troubleshoot Nexus logs disrupted post prolonged disconnection period

Nexus resources stream logs through an observability pipeline that collects logs from the on-premises resources and sends them over to Azure. At the time of a disconnection from Azure, this pipeline is disrupted and fails to send the logs to Azure. If the disconnection period is less than 48 hours, then the most recent logs are sent to Azure once the connection is restored. However, if the disconnection period is more than 48 hours, a token expiration occurs and the logs fail to flow even after the connection is restored. This issue is being targeted for resolution in a future release. In the meantime, you can follow the following steps to resolve this issue.

## Mitigation steps

Post reconnection, if you notice that the logs aren't flowing to Azure, you can follow the following steps to resolve the issue.
Identify the cluster, which isn't sending logs to Azure by checking the last log timestamp in Azure Data Explorer for the respective cluster. Identify a controller node for the cluster.

Execute the following run command to restart the log pipeline pods.

```azurecli
az networkcloud baremetalmachine run-command --bare-metal-machine-name <control-plane-baremetal-machine> \
--subscription <subscription> \
--resource-group <cluster-managed-resource-group> \
--limit-time-seconds 60 \
--script
"a3ViZWN0bCByb2xsb3V0IHJlc3RhcnQgLW4gbmMtc3lzdGVtIHN0YXRlZnVsc2V0LmFwcHMvbmMtcGxhdGZvcm0tZ2VuZXZhLW90ZWwtc3RhdGVmdWxzZXQ="
```
The run command executes the following script.

``` console
kubectl rollout restart -n nc-system statefulset.apps/nc-platform-geneva-otel-statefulset
```
The command restarts the pods responsible for sending logs to Azure. Once the pods are restarted, the logs should start flowing to Azure again.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
