---
title: Trino Web SSH
description: Using Trino in Web SSH
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Web SSH

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article describes how you can run queries on your Trino cluster using web ssh.

##  Run Web SSH

1. Sign in to [Azure portal](https://portal.azure.com).
  
1. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/trino-ui-web-ssh/portal-search.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster.":::
  
1. Select your cluster name from the list page.
  
   :::image type="content" source="./media/trino-ui-web-ssh/portal-search-result.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list.":::

1. Navigate to "Secure shell (SSH)" blade and click on the endpoint of a pod. You need to authenticate to open the SSH session.
  
   :::image type="content" source="./media/trino-ui-web-ssh/secure-shell-in-portal.png" alt-text="Screenshot showing secure shell and Web SSH endpoint."::: 

1. Type `trino-cli` command to run Trino CLI and connect to this cluster. Follow the command displayed to authenticate using device code.
  
   :::image type="content" source="./media/trino-ui-web-ssh/cmd-trino-command-line-interface.png" alt-text="Screenshot showing login to trino CLI using Web SSH.":::

Now, you can run queries.

## Next steps
* [Trino CLI](./trino-ui-command-line-interface.md)
