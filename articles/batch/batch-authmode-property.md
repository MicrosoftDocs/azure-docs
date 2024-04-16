---
title: Use Authentication Mode for Batch Management solutions
description: How to use the Authentication Mode when creating Azure Batch account.
ms.topic: how-to
ms.date: 04/16/2024
---

# Disable local or shared access key authentication with Azure Batch Service 
There are three ways to authenticate Azure Batch Services and manage authentication: 
- Microsoft Entra ID
- Shared_Key
- Task_Authentication_Token

Microsoft Entra ID provides superior security and ease of use over Share_Key and Task_Authentication_Token. With Microsoft Entra ID, there’s no need to store the tokens in your code and risk potential security vulnerabilities. We recommend that you use Microsoft Entra ID with your Azure Batch Service applications when possible.

This article explains how to disable SAS key authentication and use only Microsoft Entra ID for authentication.

After you provide your credentials, the sample application can proceed to issue authenticated requests to the Batch management service.

## Next steps

- For more information on running the [AccountManagement sample application](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/AccountManagement), see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.md).
- To learn more about Microsoft Entra ID, see the [Microsoft Entra Documentation](../active-directory/index.yml).
- In-depth examples showing how to use MSAL are available in the [Azure Code Samples](https://azure.microsoft.com/resources/samples/?service=active-directory) library.
- To authenticate Batch service applications using Microsoft Entra ID, see [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).
