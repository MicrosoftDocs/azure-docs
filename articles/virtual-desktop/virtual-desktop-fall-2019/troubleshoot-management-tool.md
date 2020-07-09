---
title: Windows Virtual Desktop management tool - Azure
description: How to troubleshoot issues with the Windows Virtual Desktop management tool.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 03/30/2020
ms.author: helohr
manager: lizross
---
# Troubleshoot the Windows Virtual Desktop management tool

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects.

This article describes issues that can occur while deploying the Windows Virtual Desktop management tool and how to fix them.

## Error: Management tool services configured but automated setup fails

When you successfully set up services for the management tool but automated setup fails, you'll see this error message:

```console
{"code":"DeploymentFailed","message":"At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-debug for usage details.","details":[{"code":"Conflict","message":"{\r\n "status": "Failed",\r\n "error": {\r\n "code": "ResourceDeploymentFailure",\r\n "message": "The resource operation completed with terminal provisioning state 'Failed'."\r\n }\r\n}"}]}
```

This usually means one of the following two things:

- The user has owner permissions on their subscription and global admin at tenant level, but they can't sign in to Azure.
- The user's account settings have multi-factor authentication enabled.

To fix this:

1. Make sure the user you created for the Azure Active Directory User Principal Name has the "Contributor" subscription level.
2. Sign in to <portal.azure.com> with the UPN account to check the account settings and make sure multi-factor authentication isn't on. If it's turned on, turn it off.
3. Visit the Windows Virtual Desktop Consent page and make sure the server and client apps have consent.
4. Review the [Deploy a management tool](manage-resources-using-ui.md) tutorial if the issue continues and redeploy the tool.

## Error: Job with specified ID already exists

If your user sees the error message "Job with specified ID already exists," it's because they didn't provide a unique name in the "Application name" parameter when deploying the template.

To fix this, redeploy the management tool with the "Application name" parameter filled.

## Delayed consent prompt when opening management tool

When you deploy the management tool, the consent prompt might not open right away. This means the Azure Web app service is taking longer than usual to load. The prompt should appear after Azure Web is done loading.

## The user can't deploy the management tool in the East US region

If a customer sets the region to East US, they can't deploy the management tool.

To fix this, deploy the management tool in a different region. Redeploying the tool in a different region shouldn't affect user experience.

## Next steps

- Learn about escalation tracks at [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview-2019.md).
- Learn how to report issues with Windows Virtual Desktop tools at [ARM Templates for Remote Desktop Services](https://github.com/Azure/RDS-Templates/blob/master/README.md).
- To learn how to deploy the management tool, see [Deploy a management tool](manage-resources-using-ui.md).