---
author: karlerickson
ms.author: caiqing
ms.service: spring-cloud
ms.topic: include
ms.date: 01/18/2022
---

<!-- 
Use the following line at the end of the Prerequisites section, where relevant. Note that the bullet point is NOT included in the include itself, but should be included on the line you paste in, exactly as shown below. The Prerequisites list should not have any line breaks between bullet points, including this one. These specific instructions are necessary so that the Prerequisites list will build as a single-spaced list, without extra blank spaces.

- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

-->

The preview version (3.0.0 or later) of the Azure Spring Cloud extension for Enterprise tier. Use the following command to install:

   ```azurecli
   az extension remove --name spring-cloud
   az extension add \
       --source https://ascprivatecli.blob.core.windows.net/enterprise/spring_cloud-3.0.0-py3-none-any.whl \
       --yes
   ```
