---
 title: include file
 description: include file
 services: private-link
 author: asudbring
 ms.service: private-link
 ms.topic: include
 ms.date: 08/29/2023
 ms.author: allensu
 ms.custom: include file
---

## Create web app

1. In the search box at the top of the portal, enter **App Service**. Select **App Services** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in the **Basics** tab of **Create Web App**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource Group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter a unique name for the web app. The name **webapp8675** is used for the examples in this tutorial. |
    | Publish | Select **Code**. |
    | Runtime stack | Select **.NET 6 (LTS)**. |
    | Operating System | Select **Windows**. |
    | Region | Select **East US 2**. |
    | **Pricing plans** |   |
    | Windows Plan (West US 2) | Leave the default name. |
    | Pricing plan | Select **Change size**. |
    
4. In **Spec Picker**, select **Production** for the workload.

5. In **Recommended pricing tiers**, select **P1V2**.

6. Select **Apply**.

7. Select **Next: Deployment**.

8. Select **Next: Networking**.

9. Change 'Enable public access' to false.

10. Select **Review + create**.

11. Select **Create**.
