To troubleshoot password writeback connectivity
===============================================
If you are experiencing service interruptions with the password writeback component of Azure AD Sync or Azure AD Connect, here are some quick steps you can take to resolve this:

* Restart the Azure AD Sync Service
* Disable and re-enable the password writeback feature in the Azure AD Sync or Azure AD Connect configuration wizard
* Install the latest Azure AD Sync or Azure AD Connect release
* Review the detailed troubleshooting guidance

In general, we recommend that you execute these steps in the order above in order to recover your service in the most rapid manner.

Restart the Azure AD Sync Service
----------------------------------
Restarting the Azure AD Sync Service can help to resolve connectivity issues or other transient issues with the service.
1)	As an administrator, click Start on the server running Azure AD Sync or Azure AD Connect.
2)	Type “services.msc” in the search box and press Enter.
3)	Look for the Microsoft Azure AD Sync entry.
4)	Right-click on the service entry, click Restart, and wait for the operation to complete.
 
These steps will re-establish your connection with our cloud service and resolve any interruptions you may be experiencing.  If restarting the Azure AD Sync Service does not resolve your issue, we recommend that you try to disable and re-enable the password writeback feature as a next step.

Disable and re-enable the password writeback feature
----------------------------------------
Disabling and re-enabling the password writeback feature can help to resolve connectivity issues.

1. As an administrator, open the Azure AD Sync or Azure AD Connect configuration wizard.
2. On the **Connect to Azure AD** screen, enter your Azure AD global admin credentials.
3. On the **Connect to AD DS** screen, enter your AD Domain Services admin credentials.
4. On the **Uniquely identifying your users** screen, click the **Next** button.
5. On the **Optional features** screen, uncheck the **Password write-back** checkbox.

<center>![Disable the Password write-back checkbox][disable-writeback]</center>

6. Click **Next** through the remaining screens without changing anything until you get to the **Ready to configure** screen.
7. Ensure that the configure screen shows the **Password write-back** option as disabled and then click the green **Configure** button to commit your changes.
8. On the **Finished** screen, deselect the **Synchronize now** option and click the **Finish** button to close the wizard.
9. Re-open the Azure AD Sync or Azure AD Connect configuration wizard.
10.	Repeat steps 2-8, except ensure you check the **Password write-back** option on the Optional features screen to re-enable the service.

These steps will re-establish your connection with our cloud service and resolve any interruptions you may be experiencing.  If disabling and re-enabling the password writeback feature does not resolve your issue, we recommend that you try to re-install Azure AD Sync or Azure AD Connect as a next step.

Install the latest Azure AD Sync release
--------------------------------------------
Re-installing the Azure AD Sync package will resolve any configuration issues which may be affecting your ability to either connect to our cloud services or to manage passwords in your local AD environment.  We recommend you perform this step only after attempting the first two steps described above.

1. Download the latest version of Azure AD Sync from the following link: http://go.microsoft.com/fwlink/?LinkId=511690 .
2. Since you have already installed Azure AD Sync, you will only need to perform an in-place upgrade to update your Azure AD Sync installation to the latest version.
3. Execute the downloaded package and follow the on-screen instructions to update your Azure AD Sync machine.  No additional manual steps are required.


These steps will re-establish your connection with our cloud service and resolve any interruptions you may be experiencing.  If installing the latest version of the Azure AD Sync server does not resolve your issue, we recommend that you try disabling and re-enabling password writeback as a final step after installing the latest sync QFE.  If that does not resolve your issue, then we recommend that you take a look at the [Password Writeback Troubleshooting Guide](https://msdn.microsoft.com/library/azure/dn683878.aspx#BKMK_7) and [Password Writeback FAQ](https://msdn.microsoft.com/library/azure/dn683878.aspx#BKMK_d) to see if your issue may be discussed there.

[disable-writeback]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Disable Password Writeback"
[enable-writeback]: 