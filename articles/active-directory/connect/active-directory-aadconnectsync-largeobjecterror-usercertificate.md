# Azure AD Connect sync: Handling LargeObject errors caused by userCertificate attribute

Azure AD enforces a maximum limit of **15** certificate values on the **userCertificate** attribute. If Azure AD Connect exports to Azure AD an object with more than 15 values, Azure AD will return a **LargeObject** error with message *"The provisioned object is too large. Trim the number of attribute values on this object. The operation will be retried in the next synchronization cycle..."*

The LargeObject error may be caused by other AD attributes. To confirm it is indeed caused by the userCertificate attribute, you need to verify against the object in on-premises AD or in the [Synchronization Service Manager Metaverse Search](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-service-manager-ui-mvsearch).

To obtain the list of objects in your tenant with LargeObject errors, use one of the following methods:

 * If your tenant is enabled for Azure AD Connect Health for sync, you can refer to the [Synchronization Error Report](https://docs.microsoft.com/azure/active-directory/connect-health/active-directory-aadconnect-health-sync#object-level-synchronization-error-report-preview) provided.
 
 * The notification email for directory synchronization errors that is sent at the end of each sync cycle has the list of objects with LargeObject errors.
 
 * The [Synchronization Service Manager Operations tab](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-service-manager-ui-operations) displays the list of objects with LargeObject errors if you click on the latest Export to Azure AD operation.
 
## Mitigation options
Until the LargeObject error is resolved, other attribute changes to the same object will not be exported to Azure AD. To resolve the error, you can consider the following options:

 * Implement an **outbound sync rule** in Azure AD Connect that will export a **null** value instead of the actual values **if more than 15 certificate values detected**. This option is suitable if you do not require any of the certificate values to be exported to Azure AD for objects with more than 15 values. For details on how to implement this sync rule, refer to the next section.

 * Reduce the number of certificate values on the on-premises AD object to 15 or less by removing values that are no longer in use by your organization. This is suitable if the attribute bloat is caused by expired or unused certificates. You can use the [PowerShell script available here](https://gallery.technet.microsoft.com/Remove-Expired-Certificates-0517e34f) to help find, backup and delete expired certificates in your on-premises AD. Before deleting the certificates, it is recommended that you verify with the validity of the certificate values with the Public-Key-Infrastructure administrators in your organization.

 * Configure Azure AD Connect to exclude the userCertificate attribute from being exported to Azure AD. In general, we do not recommend this option since the attribute may be used by Microsoft Online Services to enable specific scenarios. In particular:

    * The userCertificate attribute on the User object is used by Exchange Online and Outlook clients for message signing and encryption. To learn more about this feature, please refer to article [MIME for message signing and encryption](https://technet.microsoft.com/en-us/library/dn626158(v=exchg.150).aspx).

    * The userCertificate attribute on the Computer object is used by Azure AD to allow Windows 10 domain-joined devices to connect to Azure AD. To learn more about this feature, please refer to article [Connect domain-joined devices to Azure AD for Windows 10 experiences](https://docs.microsoft.com/azure/active-directory/active-directory-azureadjoin-devices-group-policy).

