# Using Azure AD Connect Health with AD DS
The following documentation is specific to monitoring Active Directory Domain Services with Azure AD Connect Health. For information on monitoring AD FS with Azure AD Connect Health see Using Azure AD Connect Health with AD FS. Additionally, for information on monitoring Azure AD Connect (Sync) with Azure AD Connect Health see Using Azure AD Connect Health for Sync.

<include image>

# Alerts for Azure AD Connect Health for AD DS
The Azure AD Connect Health Alerts for AD DS section provides you the list of active alerts. Each alert includes relevant information, resolution steps, and links to related documentation. By selecting an active or resolved alert you will see a new blade with additional information, as well as steps you can take to resolve the alert, and links to additional documentation. You can also view historical data on alerts that were resolved in the past.
By selecting an alert you will be provided with additional information as well as steps you can take to resolve the alert and links to additional documentation.
<include image>

# Domain Controllers, Domains and Sites
This feature provides a view of your environment while grouping domain controllers by domain or site, and including key operational metrics. This provides a quick and easy way to understand not only the layout of your environment (great if you have a large set of domain controllers) but also a way to understand the health status and identify any domain controllers that may require further investigation.

<include image>
By default, only a preselected number of columns are displayed by default; however, to see more operations on the connector or to view operations from other connectors, click on the columns command and choose the specific metrics you are interested in.

# Replication Status
This feature enables you to keep an eye on the state of replication. Not only does it allow you to see where replication is happening from, but it also includes helpful links to documentation, when an error is found.
<include image>

# Monitoring
This feature provides a graphical trend of different performance counters that are being collected from each of the monitored domain controllers. Today, trying to see this information across multiple domain controllers is difficult. The chart gives you, not only a simpler way of monitoring the performance of your domain controllers, but also a single visual across your entire environment.
<!--![Monitoring](./media/active-directory-aadconnect-health/aadconnect-health-adds-monitoring.png)</center> -->

By default, the Used Processor metric is displayed. To see other performance metrics, click on the edit chart command and choose the specific performance counter and desired time range.

## Related links

* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Agent Installation](active-directory-aadconnect-health-agent-install.md)
* [Azure AD Connect Health Operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
* [Azure AD Connect Health Version History](active-directory-aadconnect-health-version-history.md)
