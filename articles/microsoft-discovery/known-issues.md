---
title: Known issues for Microsoft Discovery
description: Learn about current known issues in Microsoft Discovery and the recommended workarounds.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: troubleshooting-known-issue
ms.date: 09/24/2026

#customer intent: As a Microsoft Discovery user or administrator, I want to identify known issues and apply available workarounds.

---

# Known issues for Microsoft Discovery

This article lists current known issues that you might encounter when you use Microsoft Discovery and provides workarounds where available. For general diagnostic guidance, see [Troubleshoot Microsoft Discovery](troubleshoot-microsoft-discovery.md). For a specific error code or message, see [Microsoft Discovery error codes](troubleshooting-error-code.md).

## Discovery Studio sign-in fails because of stale browser data

When you open Microsoft Discovery Studio, sign-in might fail with the following message:

```output
Login failed. Please try again or contact support if the issue persists.
```

This issue can occur when the browser has stale authentication cookies or cached site data for Discovery Studio.

**Workaround:**

1. In the browser address bar, select the site information icon for `studio.discovery.microsoft.com`.
1. Open the browser's cookies and site data settings.
1. Delete the cookies and site data for `studio.discovery.microsoft.com`.
1. Reload the page, and then sign in again.

If sign-in still fails, [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Azure Policy blocks public IP creation during supercomputer deployment

A supercomputer deployment can fail when its network configuration requires a public IP address but an Azure Policy assignment denies public IP creation. The deployment operation includes an error similar to the following message:

```output
Create or update public IP failed. Resource was disallowed by policy.
Error code: RequestDisallowedByPolicy
```

**Workaround:**

- To deploy without a managed public IP for egress, configure the supercomputer to use `UserDefinedRouting` and provide the required management subnet, route table, and egress appliance. For instructions, see [Configure secure networking for a Microsoft Discovery supercomputer](how-to-configure-supercomputer-network-security.md).
- If your deployment configuration requires a public IP address, ask your Azure Policy administrator whether an exemption is permitted at the deployment scope. Don't remove or bypass an organizational policy without approval.

## An unsupported region appears as a deployment option

A region that isn't currently supported for Microsoft Discovery might appear in a portal, template, or older version of the Discovery Toolbox. Deployment can then fail because of regional service availability, capacity, quota, or policy restrictions.

**Workaround:**

1. Use the current Discovery Toolbox or infrastructure template.
1. Deploy to a supported production region: **East US**, **Sweden Central**, or **UK South**.
1. Create the resources for a deployment in the same region.

For current prerequisites and region guidance, see [Quickstart: Deploy Microsoft Discovery infrastructure](quickstart-infrastructure.md#prerequisites).

