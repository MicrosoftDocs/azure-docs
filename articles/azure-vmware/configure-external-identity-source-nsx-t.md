---
title: Configure external identity source for NSX-T Data Center
description: Learn how to use the Azure VMware Solution to configure an external identity source for NSX-T Data Center.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/17/2022

---
# Configure external identity source for NSX-T Data Center

In this article, you'll learn how to configure an external identity source for NSX-T Data Center in an Azure VMware Solution. The NSX-T Data Center can be configured with external LDAP directory service to add remote directory users or groups. The users can be assigned an NSX-T Data Center Role-based access control (RBAC) role like you've on-premises. 

## Prerequisites 

- A working connectivity from your Active Directory network to your Azure VMware Solution private cloud. 
- If you require Active Directory authentication with LDAPS:
    - You'll need access to the Active Directory Domain Controller(s) with Administrator permissions. 

    - Your Active Directory Domain Controller(s) must have LDAPS enabled with a valid certificate. The certificate could be issued by an [Active Directory Certificate Services Certificate Authority (CA)](https://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx) or a [third-party CA](/troubleshoot/windows-server/identity/enable-ldap-over-ssl-3rd-certification-authority).
    >[!Note] 
    > Self-sign certificates are not recommended for production environments.   
    
- Ensure your Azure VMware Solution has DNS resolution configured to your on-premises AD. Enable DNS Forwarder from Azure portal. For more information, see [Configure NSX-T Data Center DNS for resolution to your Active Directory Domain and Configure DNS forwarder for Azure VMware Solution](configure-dns-azure-vmware-solution.md) .    
>[!NOTE] 
> For more information about LDAPS and certificate issuance, see with your security or identity management team.

## Add Active Directory as LDAPS identity source 

1. Sign-in to NSX-T Manager and Navigate to System > Users and Roles > LDAP. 

1. Select on the Add Identity Source. 

1. Enter a name for the identity source. For example, avslab.local. 

1. Enter a domain name. The name must correspond to the domain name of your Active Directory server, if using Active Directory. For example, `avslab.local`. 

1. Select the type as Active Directory over LDAP, if using Active Directory. 

1. Enter the Base DN. Base DN is the starting point that an LDAP server uses when searching for user authentication within an Active Directory domain. For example: DC=avslab,DC=local. 
   >[!NOTE]
   > All of the user and group entries you intend to use to control access to NSX-T Data Center must be contained within the LDAP directory tree rooted at the specified Base DN. If the Base DN is set to something too specific, such as an Organizational Unit deeper in your LDAP tree, NSX may not be able to find the entries it needs to locate users and determine group membership. Selecting a broad Base DN is a best practice if you are unsure. 

1. After filling in the required fields, you can select Set to configure LDAP servers. One LDAP server is supported for each domain.  

   | **Field** | **Value** |
   | ----- | ----- |
   |Hostname/IP | The hostname or IP address of your LDAP server.  For example, `dc.avslab.local.`| 
   | LDAP Protocol | Select **LDAPS** (LDAP is unsecured). |
   | Port | The default port is populated based on the selected protocol 636 for LDAPS and 389 for LDAP. If your LDAP server is running on a non-standard port, you can edit this text box to give the port number. |
   | Connection Status | After filling in the mandatory text boxes, including the LDAP server information, select **Connection Status** to test the connection. |
   | Use StartTLS | If selected, the LDAPv3 StartTLS extension is used to upgrade the connection to use encryption. To determine if you should use this option, consult your LDAP server administrator. This option can only be used if LDAP protocol is selected. |
   | Certificate  | If you're using LDAPS or LDAP + StartTLS, this text box should contain the PEM-encoded X.509 certificate of the server. If you leave this text box blank and select the **Check Status** link, NSX connects to the LDAP server. NSX will then retrieve the LDAP server's certificate, and prompt you if you want to trust that certificate. If you've verified that the certificate is correct, select **OK**, and the certificate text box will be populated with the retrieved certificate. |
   |Bind Identity | The format is `user@domainName`, or you can specify the distinguished name. For Active Directory, you can use either the userPrincipalName (user@domainName) or the distinguished name. For OpenLDAP, you must supply a distinguished name. This text box is required unless your LDAP server supports anonymous bind, then it's optional. Consult your LDAP server administrator if you aren't sure.|
   |Password |Enter a password for the LDAP server. This text box is required unless your LDAP server supports anonymous bind, then it's optional. Consult your LDAP server administrator.|
1. Select **Add**. 
       :::image type="content" source="./media/nsxt/set-ldap-server.png" alt-text="Screenshot showing how to set an LDAP server." border="true" lightbox="./media/nsxt/set-ldap-server.png":::
 
      
1. Select **Save** to complete the changes.
       :::image type="content" source="./media/nsxt/user-roles-ldap-server.png" alt-text="Screenshot showing user roles on an LDAP server." border="true" lightbox="./media/nsxt/user-roles-ldap-server.png":::

## Assign other NSX-T Data Center roles to Active Directory identities 

After adding an external identity, you can assign NSX-T Data Center Roles to Active Directory security groups based on your organization's security controls. 

1. Sign in to NSX-T Manager and navigate to **System** > **Users and Roles**.
       
1. Select **Add** > **Role Assignment for LDAP**.  

     1. Select a domain. 
     1. Enter the first few characters of the user's name, sign in ID, or a group name to search the LDAP directory, then select a user or group from the list that appears.
     1. Select a role. 
     1. Select **Save**.
    :::image type="content" source="./media/nsxt/user-roles-ldap-review.png" alt-text="Screenshot showing how to review different roles on the LDAP server." border="true" lightbox="./media/nsxt/user-roles-ldap-review.png":::

1. Verify the permission assignment is displayed under **Users and Roles**.
:::image type="content" source="./media/nsxt/user-roles-ldap-verify.png" alt-text="Screenshot showing how to verify user roles on an LDAP server." border="true" lightbox="./media/nsxt/user-roles-ldap-verify.png":::

1. Users should now be able to sign in to NSX-T Manager using their Active Directory credentials. 

## Next steps
Now that you've configured the external source, you can also learn about:

- [Configure external identity source for vCenter Server](configure-identity-source-vcenter.md)
- [Azure VMware Solution identity concepts](concepts-identity.md)
- [VMware product documentation](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-DB5A44F1-6E1D-4E5C-8B50-D6161FFA5BD2.html)

