---
title: Create non-interactive authentication .NET HDInsight applciations - Azure | Microsoft Docs
description: Learn how to create non-interactive authentication .NET HDInsight applications.
editor: cgronlun
manager: jhubbard
services: hdinsight
documentationcenter: ''
tags: azure-portal
author: mumian

ms.assetid: 8e32430f-6404-498a-9fcd-f20338d964af
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2017
ms.author: jgao

---
# Create non-interactive authentication .NET HDInsight applications
You can run your .NET Azure HDInsight application either under application's own identity (non-interactive) or under the identity of the signed-in user of the application (interactive). For a sample of the interactive application, see [Connect to Azure HDInsight](hdinsight-administer-use-dotnet-sdk.md#connect-to-azure-hdinsight). This article shows you how to create non-interactive authentication .NET application to connect to Azure and manage HDInsight.

From your non-interactive .NET application, you need:

* Your Azure subscription tenant ID (A.K.A directory ID). See [Get tenant ID](../azure-resource-manager/resource-group-create-service-principal-portal.md#get-tenant-id).
* The Azure Active Directory application client ID. See [Create an Azure Active Directory application](../azure-resource-manager/resource-group-create-service-principal-portal.md#create-an-azure-active-directory-application), and [Get an application ID](../azure-resource-manager/resource-group-create-service-principal-portal.md#get-application-id-and-authentication-key)
* The Azure Active Directory application secret key. See [Get application authentication key](../azure-resource-manager/resource-group-create-service-principal-portal.md#get-application-id-and-authentication-key)

## Prerequisites
* HDInsight cluster. See [getting started tutorial](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster).



## Assign Azure AD application to role
You must assign the application to a [role](../active-directory/role-based-access-built-in-roles.md) to grant it permissions for performing actions. You can set the scope at the level of the subscription, resource group, or resource. The permissions are inherited to lower levels of scope (for example, adding an application to the Reader role for a resource group means it can read the resource group and any resources it contains). In this tutorial, you will set the scope at the resource group level. For more information, see [Use role assignments to manage access to your Azure subscription resources](../active-directory/role-based-access-control-configure.md)

**To add the Owner role to the Azure AD application**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **Resource Group** from the left pane.
3. Click the resource group that contains the HDInsight cluster where you will run your Hive query later in this tutorial. If there are too many resource groups, you can use the filter.
4. Click **Access control (IAM)** from the resource group menu.
5. Click **Add** from the **Users** blade.
6. Follow the instruction to add the **Owner** role to the Azure AD application you created in the last procedure. When you complete it successfully, you shall see the application listed in the Users blade with the Owner role.

## Develop HDInsight client application

1. Create a C# console application.
2. Add the following Nuget packages:

        Install-Package Microsoft.Azure.Common.Authentication -Pre
        Install-Package Microsoft.Azure.Management.HDInsight -Pre
        Install-Package Microsoft.Azure.Management.Resources -Pre

3. Use the following code sample:

        using System;
        using System.Security;
        using Microsoft.Azure;
        using Microsoft.Azure.Common.Authentication;
        using Microsoft.Azure.Common.Authentication.Factories;
        using Microsoft.Azure.Common.Authentication.Models;
        using Microsoft.Azure.Management.Resources;
        using Microsoft.Azure.Management.HDInsight;
        
        namespace CreateHDICluster
        {
            internal class Program
            {
                private static HDInsightManagementClient _hdiManagementClient;
        
                private static Guid SubscriptionId = new Guid("<Enter Your Azure Subscription ID>");
                private static string tenantID = "<Enter Your Tenant ID (A.K.A. Directory ID)>";
                private static string applicationID = "<Enter Your Application ID>";
                private static string secretKey = "<Enter the Application Secret Key>";
        
                private static void Main(string[] args)
                {
                    var key = new SecureString();
                    foreach (char c in secretKey) { key.AppendChar(c); }

                    var tokenCreds = GetTokenCloudCredentials(tenantID, applicationID, key);
                    var subCloudCredentials = GetSubscriptionCloudCredentials(tokenCreds, SubscriptionId);
        
                    var resourceManagementClient = new ResourceManagementClient(subCloudCredentials);
                    resourceManagementClient.Providers.Register("Microsoft.HDInsight");
        
                    _hdiManagementClient = new HDInsightManagementClient(subCloudCredentials);
        
                    var results = _hdiManagementClient.Clusters.List();
                    foreach (var name in results.Clusters)
                    {
                        Console.WriteLine("Cluster Name: " + name.Name);
                        Console.WriteLine("\t Cluster type: " + name.Properties.ClusterDefinition.ClusterType);
                        Console.WriteLine("\t Cluster location: " + name.Location);
                        Console.WriteLine("\t Cluster version: " + name.Properties.ClusterVersion);
                    }
                    Console.WriteLine("Press Enter to continue");
                    Console.ReadLine();
                }

                /// Get the access token for a service principal and provided key                
                public static TokenCloudCredentials GetTokenCloudCredentials(string tenantId, string clientId, SecureString secretKey)
                {
                    var authFactory = new AuthenticationFactory();
                    var account = new AzureAccount { Type = AzureAccount.AccountType.ServicePrincipal, Id = clientId };
                    var env = AzureEnvironment.PublicEnvironments[EnvironmentName.AzureCloud];
                    var accessToken =
                        authFactory.Authenticate(account, env, tenantId, secretKey, ShowDialog.Never).AccessToken;
        
                    return new TokenCloudCredentials(accessToken);
                }
        
                public static SubscriptionCloudCredentials GetSubscriptionCloudCredentials(SubscriptionCloudCredentials creds, Guid subId)
                {
                    return new TokenCloudCredentials(subId.ToString(), ((TokenCloudCredentials)creds).Token);
                }
            }
        }

## Next steps
* [Create Azure Active Directory application and service principal using portal](../azure-resource-manager/resource-group-create-service-principal-portal.md)
* [Authenticate service principal with Azure Resource Manager](../azure-resource-manager/resource-group-authenticate-service-principal.md)
* [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md)
