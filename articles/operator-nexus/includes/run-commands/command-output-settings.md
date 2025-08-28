---
author: PerfectChaos
ms.author: chaoschhapi
ms.date: 07/09/2025
ms.topic: include
ms.service: azure-operator-nexus
---

## Send command output to a user specified Storage Account

To configure the Storage Account and container to which command output is sent, see [Azure Operator Nexus Cluster support for managed identities and user provided resources](../../howto-cluster-managed-identity-user-provided-resources.md).

[!INCLUDE [command-output-access](./command-output-access.md)]

## Verify access to the specified Storage Account

Before running commands, you might wish to verify you have access to the specified Storage Account:

1. From the Azure portal, navigate to the Storage Account.
1. In the Storage Account details, select **Storage browser** from the navigation menu on the left side.
1. In the Storage browser details, select **Blob containers**.
1. Find the container to which command output is to be sent and select it.
1. If you encounter errors while accessing the Storage Account or container, the user you're using might need a role assignment for the Storage Account or container. Alternatively, the Storage Account’s firewall settings might need to be updated to include your IP address.
