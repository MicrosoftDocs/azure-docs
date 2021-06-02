---
title: Connect to an external identity source
description: Learn how to set up a connection to an external identity source using the LDAP run command so that you can create and manage credentials for use with connected services. 
ms.topic: how-to
ms.date: 06/28/2021

#Customer intent: As an Azure service administrator, I want to set up a connection to an external identity source using the LDAP run command so that I can create and manage credentials for use with connected services.

---

# Connect to an external identity source

You can use your cloudadmin credentials for connected services like HCX, vRealize Orchestrator, vRealize Operations Manager, or VMware Horizon. You must first set up a connection to an external identity source (LDAP) to create and manage credentials for use with connected services. 

>[!NOTE]
>If you don't have an external identity source, such as Active Directory, you shouldn't rotate your cloudadmin credentials. Rotating could break any connections that use the vCenter or NSX-T credentials. It could also lock out those accounts, resulting in a security lockout.


1. Sign in to your Azure VMware Solution private cloud and select **Operations** > **Run Commands**.

   :::image type="content" source="media/rotate-cloudadmin-credentials/rotate-credentials-ldap-run-commands.png" alt-text="Screenshot showing the Operations Run Command for LDAP.":::

1. Select **LDAP** from the available commands.  This built-in command is not editable. 

1. Select **Run**. After the script finishes, it returns the output and any errors.