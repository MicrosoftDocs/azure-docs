---
title: "Deploy WebLogic Server on Azure Kubernetes Service using the Azure portal"
description: Shows how to quickly stand up WebLogic Server on Azure Kubernetes Service.
author: KarlErickson
ms.author: edburns
ms.topic: how-to
ms.date: 06/22/2023
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, devx-track-extended-java
---

# Deploy a Java application with WebLogic Server on an Azure Kubernetes Service (AKS) cluster

This article shows you how to quickly deploy WebLogic Application Server (WLS) on Azure Kubernetes Service (AKS) with the simplest possible set of configuration choices using the Azure portal. For a more full featured tutorial, including the use of Azure Application Gateway to make WLS on AKS securely visible on the public Internet, see [Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer](/azure/developer/java/migration/migrate-weblogic-with-app-gateway).

For step-by-step guidance in setting up WebLogic Server on Azure Kubernetes Service, see the official documentation from Oracle at [Azure Kubernetes Service](https://oracle.github.io/weblogic-kubernetes-operator/samples/azure-kubernetes-service/).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by WLS on AKS, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).
- Have the credentials for an Oracle single sign-on (SSO) account. To create one, see [Create Your Oracle Account](https://aka.ms/wls-aks-create-sso-account).
- Accept the license terms for WLS.
  - Visit the [Oracle Container Registry](https://container-registry.oracle.com/) and sign in.
  - If you have a support entitlement, select **Middleware**, then search for and select **weblogic_cpu**.
  - If you don't have a support entitlement from Oracle, select **Middleware**, then search for and select **weblogic**.
    > [!NOTE]
    > Get a support entitlement from Oracle before going to production. Failure to do so results in running insecure images that are not patched for critical security flaws. For more information on Oracle's critical patch updates, see [Critical Patch Updates, Security Alerts and Bulletins](https://www.oracle.com/security-alerts/) from Oracle.
  - Accept the license agreement.

## Create a storage account and storage container to hold the sample application

Use the following steps to create a storage account and container. Some of these steps direct you to other guides. After completing the steps, you can upload a sample application to run on WLS on AKS.

1. Download a sample application as a *.war* or *.ear* file. The sample app should be self-contained and not have any database, messaging, or other external connection requirements. The sample app from the WLS Kubernetes Operator documentation is a good choice. You can download [testwebapp.war](https://aka.ms/wls-aks-testwebapp) from Oracle. Save the file to your local filesystem.
1. Sign in to the [Azure portal](https://aka.ms/publicportal).
1. Create a storage account by following the steps in [Create a storage account](/azure/storage/common/storage-account-create). You don't need to perform all the steps in the article. Just fill out the fields as shown on the **Basics** pane, then select **Review + create** to accept the default options. Proceed to validate and create the account, then return to this article.
1. Create a storage container within the account. Then, upload the sample application you downloaded in step 1 by following the steps in [Quickstart: Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal). Upload the sample application as the blob, then return to this article.

## Deploy WLS on AKS

The steps in this section direct you to deploy WLS on AKS in the simplest possible way. WLS on AKS offers a broad and deep selection of Azure integrations. For more information, see [What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service?](/azure/virtual-machines/workloads/oracle/weblogic-aks)

The following steps show you how to find the WLS on AKS offer and fill out the **Basics** pane.

1. In the search bar at the top of the Azure portal, enter *weblogic*. In the auto-suggested search results, in the **Marketplace** section, select **Oracle WebLogic Server on Azure Kubernetes Service**.

   :::image type="content" source="media/howto-deploy-java-wls-app/marketplace-search-results.png" alt-text="Screenshot of the Azure portal showing WLS in search results." lightbox="media/howto-deploy-java-wls-app/marketplace-search-results.png":::

   You can also go directly to the [Oracle WebLogic Server on Azure Kubernetes Service](https://aka.ms/wlsaks) offer.

1. On the offer page, select **Create**.
1. On the **Basics** pane, ensure the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.

   :::image type="content" source="media/howto-deploy-java-wls-app/portal-start-experience.png" alt-text="Screenshot of the Azure portal showing WebLogic Server on AKS." lightbox="media/howto-deploy-java-wls-app/portal-start-experience.png":::

1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and then fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier - for example, `ejb0723wls``.
1. Under **Instance details**, select the region for the deployment. For a list of Azure regions where AKS is available, see [AKS region availability](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service).
1. Under **Credentials for WebLogic**, leave the default value for **Username for WebLogic Administrator**.
1. Fill in `wlsAksCluster2022` for the **Password for WebLogic Administrator**. Use the same value for the confirmation and **Password for WebLogic Model encryption** fields.
1. Scroll to the bottom of the **Basics** pane and notice the helpful links for documentation, community support, and how to report problems.
1. Select **Next: AKS**.

The following steps show you how to start the deployment process.

1. Scroll to the section labeled **Provide an Oracle Single Sign-On (SSO) account**. Fill in your Oracle SSO credentials from the preconditions.

   :::image type="content" source="media/howto-deploy-java-wls-app/configure-single-sign-on.png" alt-text="Screenshot of the Azure portal showing the configure sso pane." lightbox="media/howto-deploy-java-wls-app/configure-single-sign-on.png":::

1. In the **Application** section, next to **Deploy an application?**, select **Yes**.

   :::image type="content" source="media/howto-deploy-java-wls-app/configure-application.png" alt-text="Screenshot of the Azure portal showing the configure applications pane." lightbox="media/howto-deploy-java-wls-app/configure-application.png":::

1. Next to **Application package (.war,.ear,.jar)**, select **Browse**.
1. Start typing the name of the storage account from the preceding section. When the desired storage account appears, select it.
1. Select the storage container from the preceding section.
1. Select the checkbox next to the sample app uploaded from the preceding section. Select **Select**.

The following steps make it so the WLS admin console and the sample app are exposed to the public Internet with a built-in Kubernetes `LoadBalancer` service. For a more secure and scalable way to expose functionality to the public Internet, see [Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer](/azure/developer/java/migration/migrate-weblogic-with-app-gateway).

:::image type="content" source="media/howto-deploy-java-wls-app/configure-load-balancing.png" alt-text="Screenshot of the Azure portal showing the simplest possible load balancer configuration on the Create Oracle WebLogic Server on Azure Kubernetes Service page." lightbox="media/howto-deploy-java-wls-app/configure-load-balancing.png":::

1. Select the **Load balancing** pane.
1. Next to **Load Balancing Options**, select **Standard Load Balancer Service**.
1. In the table that appears, under **Service name prefix**, fill in the values as shown in the following table. The port values of *7001* for the admin server and *8001* for the cluster must be filled in exactly as shown.

   | Service name prefix | Target       | Port |
   |---------------------|--------------|------|
   | console             | admin-server | 7001 |
   | app                 | cluster-1    | 8001 |

1. Select **Review + create**. Ensure the green **Validation Passed** message appears at the top. If it doesn't, fix any validation problems, then select **Review + create** again.
1. Select **Create**.
1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment may take up to 30 minutes to complete.

## Examine the deployment output

The steps in this section show you how to verify that the deployment has successfully completed.

If you navigated away from the **Deployment is in progress** page, the following steps will show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to the steps after the image below.

1. In the upper left of any portal page, select the hamburger menu and select **Resource groups**.
1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.
1. In the left navigation pane, in the **Settings** section, select **Deployments**. You'll see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-wls-app/resource-group-deployments.png" alt-text="Screenshot of the Azure portal showing the resource group deployments list." lightbox="media/howto-deploy-java-wls-app/resource-group-deployments.png":::

1. In the left panel, select **Outputs**. This list shows the output values from the deployment. Useful information is included in the outputs.
1. The **adminConsoleExternalUrl** value is the fully qualified, public Internet visible link to the WLS admin console for this AKS cluster. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.
1. The **clusterExternalUrl**  value is the fully qualified, public Internet visible link to the sample app deployed in WLS on this AKS cluster. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.

The other values in the outputs are beyond the scope of this article, but are explained in detail in the [WebLogic on AKS user guide](https://aka.ms/wls-aks-docs).

## Verify the functionality of the deployment

The following steps show you how to verify the functionality of the deployment by viewing the WLS admin console and the sample app.

1. Paste the value for **adminConsoleExternalUrl** in an Internet-connected web browser. You should see the familiar WLS admin console login screen as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-wls-app/wls-admin-login.png" alt-text="Screenshot of WLS admin login screen." border="false":::

   > [!NOTE]
   > This article shows the WLS admin console merely by way of demonstration. Don't use the WLS admin console for any durable configuration changes when running WLS on AKS. The cloud-native design of WLS on AKS requires that any durable configuration must be represented in the initial docker images or applied to the running AKS cluster using CI/CD techniques such as updating the model, as described in the [Oracle documentation](https://aka.ms/wls-aks-docs-update-model).

1. Understand the `context-path` of the sample app you deployed. If you deployed the recommended sample app, the `context-path` is `testwebapp`.
1. Construct a fully qualified URL for the sample app by appending the `context-path` to the value of **clusterExternalUrl**. If you deployed the recommended sample app, the fully qualified URL will be something like `http://123.456.789.012:8001/testwebapp/`.
1. Paste the fully qualified URL in an Internet-connected web browser. If you deployed the recommended sample app, you should see results similar to the following screenshot.

   :::image type="content" source="media/howto-deploy-java-wls-app/test-web-app.png" alt-text="Screenshot of test web app." border="false":::

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the cluster, use the [az group delete](/cli/azure/group#az-group-delete) command. The following command will remove the resource group, container service, container registry, and all related resources.

```azurecli
az group delete --name <resource-group-name> --yes --no-wait
```

## Next steps

Learn more about running WLS on AKS or virtual machines by following these links:

> [!div class="nextstepaction"]
> [WLS on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)

> [!div class="nextstepaction"]
> [WLS on virtual machines](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
