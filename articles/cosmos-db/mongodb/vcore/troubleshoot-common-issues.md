---
title: Troubleshoot common errors in Azure Cosmos DB for MongoDB vCore
description: This doc discusses the ways to troubleshoot common issues encountered in Azure Cosmos DB for MongoDB vCore.
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: troubleshooting
ms.date: 08/11/2023
author: khelanmodi
ms.author: khelanmodi
---

# Troubleshoot common issues in Azure Cosmos DB for MongoDB vCore
[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Welcome to the Azure Cosmos DB for MongoDB vCore Troubleshooting Guide. This resource is tailored to assist you in resolving common issues that may arise while using this integrated database solution. The guide provides solutions for connectivity problems, error scenarios, and optimization challenges, offering practical insights to improve your experience. While these solutions offer a strong foundation, it's recommended to consult [official documentation](introduction.md) and support resources for customized assistance.

>[!Note]
> Please note that these solutions are general guidelines and may require specific configurations based on individual situations. Always refer to official documentation and support resources for the most accurate and up-to-date information.

## Common errors and solutions

### Unable to Connect to Azure Cosmos DB for MongoDB vCore - Timeout error 
This issue might occur when the cluster does not have the correct firewall rule(s) enabled. If you're trying to access the cluster from a non-Azure IP range, you need to add extra firewall rules. Refer to [Security options and features - Azure Cosmos DB for MongoDB vCore](./security.md#network-security-options) for detailed steps. Firewall rules can be configured in the portal's Networking setting for the cluster. Options include adding a known IP address/range or enabling public IP access.

:::image type="content" source="./media/troubleshoot-guide/timeout-error-solution.png" alt-text="Screenshot of the Timeout error solution for Azure Cosmos DB for MongoDB vCore":::

### Application Unable to Connect with DNSClient.DnsResponseException Error
#### Debugging Connectivity Issues: 
Psping doesn't work. The use of nslookup confirms cluster reachability and discoverability, indicating network issues are unlikely.

#### Verify your connection string: 
Only use the connection string provided in the portal. Avoid using any variations. Particularly, the connection string using mongodb+srv:// protocol and the c. prefixes aren't recommended. If the issue persists, share application/client-side driver logs for debugging connectivity issues with the team by submitting a support ticket.


## Next steps
If you've completed all the troubleshooting steps and haven't been able to discover a solution for your issue, kindly consider submitting a [Support Ticket](https://azure.microsoft.com/support/create-ticket/). 

