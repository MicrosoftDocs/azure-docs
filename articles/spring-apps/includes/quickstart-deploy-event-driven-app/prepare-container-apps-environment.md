---
author: karlerickson
ms.author: v-muyaofeng
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/31/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to create container apps environment.

[!INCLUDE [prepare-container-apps-environment](includes/quickstart-deploy-event-driven-app/prepare-container-apps-environment.md)]

-->

### [Consumption workload](#tab/Consumption-workload)

1. Fill out the **Basics** tab with the following information:

   - **Environment name**: *myacaenv*
   - **Plan**: **Consumption**
   - **Zone redundancy**: **Disabled**

1. Select **Create** to create the Container Apps Environment.

### [Dedicated workload](#tab/Dedicated-workload)

1. Fill out the **Basics** tab with the following information:

   - **Environment name**: *myacaenv*
   - **Plan**: **(Preview) Consumption and Dedicated workload profiles**
   - **Zone redundancy**: **Disabled**

1. Select the **Workload profiles (Preview)** tab, and then select **Add workload profile** to add a workload profile.

1. On the **Add workload profile (Preview)** page, add the following information:

   - **Workload profile name**: *my-wlp*
   - **Workload profile size**: Select **Dedicated-D4**
   - **Autoscaling instance count range**: Select **3** and **5**

1. Select **Add**. This selection takes you back to the **Add workload profile(Preview)** page. Select **my-wlp**, and then select **Create** to create the Container Apps Environment.

---
