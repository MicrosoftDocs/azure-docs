---
title: Troubleshoot Azure Operator Nexus Cluster has ETCD Quorum Lost
description: Provides steps to follow in the event that an `etcd` quorum is lost for an extended period of time and the KCP did not successfully return to a stable state.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 10/09/2024
ms.author: omarrivera
author: omarrivera
---
# Troubleshoot Azure Operator Nexus Cluster has ETCD Quorum Lost

This guide attempts to provide steps to follow in the event that an `etcd` quorum is lost for an extended period of time and the Kubernetes Control Plane (KCP) did not successfully return to stable state.

> [!IMPORTANT]
> At this time there is no supported approach that can be executed through customer tools.
> There will be a feature enhancement for a future release to help address this scenario.
> Please, open a support ticket via [contact support].
[!include[stillHavingIssues](./includes/contact-support.md)]

[contact support]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade