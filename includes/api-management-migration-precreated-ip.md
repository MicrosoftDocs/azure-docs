---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 08/29/2024
ms.author: danlep
---

### Precreated IP address for migration

For API Management instances that are reachable by a public IP address, API Management precreates a public IP address for the migration process. Find the precreated IP address in the JSON output of your API Management instance's properties. Under `customProperties`, the precreated IP address is the value of the `Microsoft.WindowsAzure.ApiManagement.Stv2MigrationPreCreatedIps` property. For a multi-region deployment, the value is a comma-separated list of precreated IP addresses.

Use the precreated IP address (or addresses) to help you manage the migration process:

* When you migrate and preserve the VIP address, the precreated IP address is assigned temporarily to the new `stv2` deployment, before the original IP address is assigned to the `stv2` deployment. If you have firewall rules limiting access to the API Management instance, for example, you can add the precreated IP address to the allowlist to preserve continuity of client access during migration. After migration is complete, you can remove the precreated IP address from your allowlist.
* When you migrate and generate a new VIP address, the precreated IP address is assigned to the new `stv2` deployment during migration and persists after migration is complete. Use the precreated IP address to update your network dependencies, such as DNS and firewall rules, to point to the new IP address.