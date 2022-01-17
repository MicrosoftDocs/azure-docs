---
author: karlerickson
ms.author: caiqing
ms.service: spring-cloud
ms.topic: include
ms.date: 01/18/2022
---

<!-- 
Use the following line at the end of the Prerequisites section, where relevant:
[!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
-->

The preview version (3.0.0 or later) of the Azure Spring Cloud extension for Enterprise tier. Use the following command to install:

   ```azurecli
   az extension remove --name spring-cloud
   az extension add \
       --source https://ascprivatecli.blob.core.windows.net/enterprise/spring_cloud-3.0.0-py3-none-any.whl \
       --yes
   ```
