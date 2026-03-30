---
title: Create and Manage Azure HDInsight Clusters with Microsoft Entra ID Authentication
description: Learn how to create Azure HDInsight clusters with Microsoft Entra ID authentication.
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 10/02/2025
---

# Create and manage Azure HDInsight clusters with Microsoft Entra ID authentication

In this article, you learn how to create and manage Azure HDInsight clusters with Microsoft Entra ID authentication.

Users can employ Microsoft Entra ID to securely authenticate and manage access to HDInsight clusters, which helps to ensure enterprise-grade security and centralized identity governance.

With this capability, organizations can enforce role-based access, streamline user onboarding and offboarding, and enhance compliance by using existing Microsoft Entra ID policies. It simplifies cluster security management while providing a seamless sign-in experience for data engineers, analysts, and administrators.

## Prerequisites

- An active Azure subscription with sufficient permissions to create HDInsight clusters
- Microsoft Entra ID tenant:
  - Access to a Microsoft Entra ID tenant linked to your Azure subscription
  - Permissions to create and assign Microsoft Entra ID groups and roles
- A resource group in Azure where the HDInsight cluster can be deployed
- HDInsight cluster requirements:
  - The HDInsight cluster type (for example, Hadoop, Spark, HBase, or Kafka) that you're using for deployment
  - A region that supports Microsoft Entra ID integration

## Setting up Microsoft Entra ID authentication during cluster creation

To set up Microsoft Entra ID authentication when you're creating an HDInsight cluster, follow these steps:

1. Select the **Microsoft Entra ID** authentication method.

1. When you create a cluster, add at least one Microsoft Entra ID user with **admin** credentials.

:::image type="content" source="./media/create-clusters-with-entra/creation-cluster.png" alt-text="Screenshot that shows the HDInsight cluster creation landing page." border="true" lightbox="./media/create-clusters-with-entra/creation-cluster.png":::

## User profiles in Apache Ambari

You can assign Microsoft Entra ID-enabled users one of two profiles:

- **Cluster Administrator**: Admin permission.
- **Cluster User**: View-only permission.

You can use only one method of authentication for each cluster.

If you choose Microsoft Entra ID authentication when you create a cluster, all users in the cluster must be authenticated by using Microsoft Entra ID. During the entire lifecycle of that particular cluster, only Microsoft Entra ID authentication can be used.

If you choose basic authentication when you create a cluster, all users in the cluster must be authenticated by using basic authentication. During the entire lifecycle of that particular cluster, only basic authentication can be used.

:::image type="content" source="./media/create-clusters-with-entra/select-entra-button.png" alt-text="Screenshot that shows the HDInsight landing page and the Microsoft Entra ID option." border="true" lightbox="./media/create-clusters-with-entra/select-entra-button.png":::

:::image type="content" source="./media/create-clusters-with-entra/select-entra-user.png" alt-text="Screenshot that shows how to select the user's Microsoft Entra ID when you choose a cluster admin."  border="true" lightbox="./media/create-clusters-with-entra/select-entra-user.png":::

## Sign-in options

Users can sign in via multifactor authentication (MFA) after entering their Microsoft Entra ID credentials.

## Adding users with an API

An admin can add multiple users at the same time by using an API, which is ideal for managing large clusters.

This operation allows users to change the cluster gateway HTTP credentials.

| Method | Request URI |
|------------|-----------------|
| POST | `https://management.azure.com/subscriptions/{subscription Id}/resourceGroups/{resourceGroup Name}/providers/Microsoft.HDInsight/clusters/{cluster name}/updateGatewaySettings?api-version={api-version}` |
| Entra ID cluster API version| Greater than or equal to `2025-01-15-preview`|

```json
		{ 
		"restAuthEntraUsers": [ 
			{ 
				"objectId": "0d7c4bd6-d042-45ec-9ae5-1ed7871c38e0", 
						"displayName": "Hemant Gupta", 
						"upn": "john@contoso.com" 
					} 
				] 
			} 
```

### Response

If the operation finishes successfully, you receive the response `HTTP 202` (accepted).

## Authentication process

The authentication process varies based on the method that you choose when you create a cluster.

If you choose Microsoft Entra ID:

- The cluster creator provides an ID for the default cluster administrator user in Ambari.
- The default admin can add Ambari users after cluster creation. Users might have either **Cluster Administrator** or **Cluster User** permissions. You can set these permissions via the Ambari UI or the REST API.
  - The cluster admin also has to fill in the object ID and display name, and then select **Save**.

 	  :::image type="content" source="./media/create-clusters-with-entra/add-users.png" alt-text="Screenshot that shows users in the Ambari portal." border="true" lightbox="./media/create-clusters-with-entra/add-users.png":::

    :::image type="content" source="./media/create-clusters-with-entra/user-roles.png" alt-text="Screenshot that shows the Ambari pane where the cluster admin selects roles of newly added users." border="true" lightbox="./media/create-clusters-with-entra/user-roles.png":::

  - A multifactor authentication prompt appears when the user logs in with their Microsoft Entra ID credentials.

## Basic authentication

If you choose basic authentication:

- The user provides a user ID and password for the default admin user.
- You can create new users with various roles, similar to the current functionality.
- Users are prompted to enter their user ID and password after signing in.

## Adding an object ID in the Ambari UI

1. Sign in to the Ambari portal.

   :::image type="content" source="./media/create-clusters-with-entra/login-page.png" alt-text="Screenshot the shows the Ambari landing page."  border="true" lightbox="./media/create-clusters-with-entra/login-page.png":::

2. Go to **Manage Ambari**.

   :::image type="content" source="./media/create-clusters-with-entra/click-manage.png" alt-text="Screenshot that shows the Manage Ambari button on the Ambari landing page." border="true" lightbox="./media/create-clusters-with-entra/click-manage.png":::

3. Select the **Users** tab to see all the current users.

   :::image type="content" source="./media/create-clusters-with-entra/open-user-tab.png" alt-text="Screenshot that shows the users tab." border="true" lightbox="./media/create-clusters-with-entra/open-user-tab.png":::

4. To add new users, select **ADD USERS**.

   :::image type="content" source="./media/create-clusters-with-entra/add-users.png" alt-text="Screenshot that shows users in the Ambari portal." border="true" lightbox="./media/create-clusters-with-entra/add-users.png":::

5. Enter the values for **Object ID** and **Display Name**. Define the user's access level by selecting **Cluster Administrator** or **Cluster User**. Select **Save**.

   :::image type="content" source="./media/create-clusters-with-entra/add-object-id.png" alt-text="Screenshot that shows the tab where you add users in the Ambari portal."  border="true" lightbox="./media/create-clusters-with-entra/add-object-id.png":::
