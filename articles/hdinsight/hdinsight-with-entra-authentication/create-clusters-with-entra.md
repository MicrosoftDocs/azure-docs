---
title: Create and Manage Azure HDInsight clusters enabled with Entra ID Authentication
description: Learn how to create Azure HDInsight clusters with Entra ID Authentication
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 10/02/2025
---

# Create and manage Azure HDInsight cluster with Entra ID authentication

This article provides comprehensive information on creating and managing Azure HDInsight clusters with Microsoft Entra ID authentication. 
Users can securely authenticate and manage access to HDInsight clusters, ensuring enterprise-grade security and centralized identity governance by using Entra ID.

With this capability, organizations can enforce role-based access, streamline user onboarding and offboarding, and enhance compliance by using existing Entra ID policies. 
It simplifies cluster security management while providing a seamless login experience for data engineers, analysts, and administrators.

## Prerequisites

Before you begin, ensure the following requirements are met:

 - Azure Subscription

    - An active Azure subscription with sufficient permissions to create HDInsight clusters.

 - Microsoft Entra ID Tenant

    - Access to an Entra ID tenant linked to your Azure subscription.

    - Permissions to create and assign Entra ID groups and roles.

 - Resource Group

    - A resource group in Azure where the HDInsight cluster can be deployed.

 - HDInsight Cluster Requirements

    - HDInsight cluster type (for example, Hadoop, Spark, HBase, or Kafka) selected for deployment.

    - Correct region chosen that supports Entra ID integration.

## Overview 

Users have to perform the following for setting up Entra ID authentication when creating a HDInsight cluster: 

  - Select the desired authentication method: Entra ID 

  - Add one (or more) admin Entra ID user during cluster creation(adding atleast one admin is mandatory).

    :::image type="content" source="./media/create-clusters-with-entra/creation-cluster.png" alt-text="Screenshot of HDInsight cluster creation landing page." border="true" lightbox="./media/create-clusters-with-entra/creation-cluster.png":::

  

## User Profiles in Ambari 

Entra ID enabled users are assigned one of two profiles: 

  - Cluster Admin: Admin permission. 

  - Cluster User: View only permission.


>[!Note]
>During cluster creation if the admin chooses Entra ID for authentication, then all the users in the cluster must be authenticated using Entra ID.
>If the admin chooses basic authentication during  cluster creation then all the users in the cluster must be authenticated using basic authentication.
>During cluster creation if the user selects Entra ID authentication, during the entire lifecycle of the particular cluster authentication can be only done using Entra ID.
>If the admin chooses basic authentication, during the entire lifecycle of the particular cluster authentication can be only done using Basic Authentication.
> **User can use only one mode of authentication for a particular cluster.**


  :::image type="content" source="./media/create-clusters-with-entra/select-entra-button.png" alt-text="Screenshot of HDInsight landing page showing the selection of entra ID option in HDInsight landing page." border="true" lightbox="./media/create-clusters-with-entra/select-entra-button.png":::

  :::image type="content" source="./media/create-clusters-with-entra/select-entra-user.png" alt-text="Screenshot of user selecting the users entra ID when selecting a cluster admin."  border="true" lightbox="./media/create-clusters-with-entra/select-entra-user.png":::

## Login Options 

Users can log in via Multifactor Authentication (MFA) once they input their Entra ID. 

## Adding users with API

Admin can add multiple users at once via an API, ideal for managing large clusters. 

 This operation allows users to change the cluster gateway HTTP credentials.   


 | **Method** | **Request URI** |
 |------------|-----------------|
 | POST | `https://management.azure.com/subscriptions/{subscription Id}/resourceGroups/{resourceGroup Name}/providers/Microsoft.HDInsight/clusters/{cluster name}/updateGatewaySettings?api-version={api-version}` |
 | Entra Cluster API Version| greater than or equal to `2025-01-15-preview`|


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
HTTP 202 (Accepted) on successful completion of the operation. 

## Authentication Process 
The authentication process varies based on the chosen method during cluster creation: 

If Entra ID is selected: 

 - The cluster creator provides an ID for the default cluster administrator user in Ambari. 

 - The default admin can add Ambari users after cluster creation. Users may have either **Cluster Administrator** or **Cluster User** permissions, set via the Ambari UI or REST API.
   The cluster admin also has to add Object ID, and the display name and click on "**Save**".

 	 :::image type="content" source="./media/create-clusters-with-entra/add-users.png" alt-text="Screenshot of Ambari page showing the users in the Ambari portal." border="true" lightbox="./media/create-clusters-with-entra/add-users.png":::

     :::image type="content" source="./media/create-clusters-with-entra/user-roles.png" alt-text="Screenshot of Ambari add users page where cluster admin selects roles of newly added users." border="true" lightbox="./media/create-clusters-with-entra/user-roles.png":::

 - A multifactor authentication prompt appears when the user logs in with their Entra ID.

## Basic Authentication

Users can use the legacy basic authentication way of authenticating users as well 

If Basic Authentication is selected: 

 - User provides a User ID and password for the default admin user. 

 - New users can be created with various roles, similar to current functionality. 

 - Users are prompted to enter their User ID and password upon login.

## Steps to add object ID in Ambari UI

   1. Log in to the Ambari portal.
   
  		:::image type="content" source="./media/create-clusters-with-entra/login-page.png" alt-text="Screenshot of Ambari landing page."  border="true" lightbox="./media/create-clusters-with-entra/login-page.png":::

   1. Navigate to "**Manage Ambari**" option.

		:::image type="content" source="./media/create-clusters-with-entra/click-manage.png" alt-text="Screenshot of Ambari landing page where cluster admin has to click on manage Ambari button." border="true" lightbox="./media/create-clusters-with-entra/click-manage.png":::
   
   1. Click on user tab to see all present users in Ambari UI.

  		:::image type="content" source="./media/create-clusters-with-entra/open-user-tab.png" alt-text="Screenshot of Ambari page where cluster admin clicks on User tab." border="true" lightbox="./media/create-clusters-with-entra/open-user-tab.png":::
    
   1. Click on "Add User" tab to add more users in the cluster.

      :::image type="content" source="./media/create-clusters-with-entra/add-users.png" alt-text="Screenshot of Ambari page showing the users in the Ambari portal." border="true" lightbox="./media/create-clusters-with-entra/add-users.png":::
      
   1. Input Object ID,  display name, and select the user access (Cluster Administrator or Cluster User). Select "**Save**".

		:::image type="content" source="./media/create-clusters-with-entra/add-object-id.png" alt-text="Screenshot of Ambari page showing thee add users tab where cluster admin has to input new user information."  border="true" lightbox="./media/create-clusters-with-entra/add-object-id.png":::


