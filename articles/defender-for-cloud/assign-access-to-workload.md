---
title: Assign access to workload owners
description: Learn how to use Defender for Cloud to assign access to a workload owner of an AWS or GCP connector so that they can view the suggested recommendations provided by Defender for Cloud.
ms.author: dacurwin
ms.topic: how-to
ms.date: 02/19/2024
---

# Assign access to workload owners


## Identify the relevant security connector 

When you onboard your AWS or GCP environments, Defender for Cloud automatically creates a security connector as an Azure resource inside the connected subscription and resource group. Defender for cloud also creates the identity provider as an IAM role it requires during the onboarding process.


Assign permission to users, on specific security connectors, below the parent connector? Yes, you can. You need to determine to which AWS accounts or GCP projects you want users to have access to. Meaning, you need to identify the security connectors that correspond to the AWS account or GCP project to which you want to assign users access.


**To identify the security connector**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**

1. Locate the relevant AWS or GCP connector.

## Configure permissions on the security connector

Permissions for a security connector can be configured through:

- All resources in the Azure portal
- Azure Resource Graph

### All resources in the Azure portal

To configure the permissions for a security connector in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **All resources**.

    :::image type="content" source="media/assign-access-to-workload/all-resources.png" alt-text="Screenshot that shows you how to search for and select all resources." lightbox="media/assign-access-to-workload/all-resources.png":::

1. Select **Manage view** > **Show hidden types**.

    :::image type="content" source="media/assign-access-to-workload/show-hidden-types.png" alt-text="Screenshot that shows you where on the screen to find the show hidden types option." lightbox="media/assign-access-to-workload/show-hidden-types.png":::

1. Select the **Types equals all** filter.

1. Enter `securityconnector` in the value field and add a check to the `microsoft.security/securityconnectors`.

    :::image type="content" source="media/assign-access-to-workload/security-connector.png" alt-text="Screenshot that shows where the field is located and where to enter the value on the screen." lightbox="media/assign-access-to-workload/security-connector.png":::

1. Select **Apply**.

1. Select the relevant resource connector.

1. [Configure the desired RBAC permissions](#configure-the-desired-rbac-permissions).

### Azure Resource Graph

To configure the permissions for a security connector in Azure Resource Graph:

1. Search for and select **Resource Graph Explorer**.

    :::image type="content" source="media/assign-access-to-workload/resource-graph-explorer.png" alt-text="Screenshot that shows you how to search for and select resource graph explorer." lightbox="media/assign-access-to-workload/resource-graph-explorer.png":::

1. Run the following relevant query to locate the security connector:

    ### [AWS](#tab/aws)
    
    ```bash
    resources 
    | where type == "microsoft.security/securityconnectors" 
    | extend source = tostring(properties.environmentName)  
    | where source == "AWS" 
    | project name, subscriptionId, resourceGroup, accountId = properties.hierarchyIdentifier, cloud = properties.environmentName  
    ```
    
    ### [GCP](#tab/gcp)
    
    ```bash
    resources 
    | where type == "microsoft.security/securityconnectors" 
    | extend source = tostring(properties.environmentName)  
    | where source == "GCP" 
    | project name, subscriptionId, resourceGroup, projectId = properties.hierarchyIdentifier, cloud = properties.environmentName  
    ```
    
    ---

1. Select **Run query**.

1. Toggle formatted results to **On**.

    :::image type="content" source="media/assign-access-to-workload/formatted-results.png" alt-text="Screenshot that shows where the formatted results toggle is located on the screen." lightbox="media/assign-access-to-workload/formatted-results.png":::

1. In the results, select the relevant subscription and resource group to locate the relevant security connector.

1. [Configure the desired role-based access control (RBAC) permissions](#configure-the-desired-rbac-permissions).

## Configure the desired RBAC permissions

1. Select **Access control (IAM)**.

    :::image type="content" source="media/assign-access-to-workload/control-i-am.png" alt-text="Screenshot that shows where to select Access control IAM in the resource you selected." lightbox="media/assign-access-to-workload/control-i-am.png":::

1. Select **+Add** > **Add role assignment**.

1. Select the desired role.

1. Select **Next**.

1. Select **+ Select members**.

    :::image type="content" source="media/assign-access-to-workload/select-members.png" alt-text="Screenshot that shows where the button is on the screen to select + select members.":::

1. Search for and select the relevant user or group.

1. Select **Select**.

1. Select **Next**.

1. Review the information.

1. Select **Review + assign**.

After setting the permission for the security connector, the workload owners will be able to view recommendations in Defender for Cloud for the AWS and GCP resources that are associated with the security connector.

## Next steps

Learn more about [available RBAC permissions](permissions.md).


