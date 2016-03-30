
<!--
includes/sql-database-include-ip-address-22-v12portal.md

Latest Freshness check:  2016-03-21 , daleche.

As of circa 2015-09-04, the following topics might include this include:
articles/sql-database/sql-database-configure-firewall-settings.md
articles/sql-database/sql-database-connect-query.md


## Server-level firewall rules

### Add a server-level firewall rule through the new Azure portal
-->


1. Log in to the [Azure portal](https://portal.azure.com/) at http://portal.azure.com/.

2. In the left banner, click **BROWSE ALL**. The **Browse** blade is displayed.

3. Scroll and click **SQL servers**. The **SQL servers** blade is displayed.

	![Find your Azure SQL Database server in the portal][b21-FindServerInPortal]

4. For convenience, click the minimize control on the earlier **Browse** blade.

5. In the filter text box, start typing the name of your server. Your row is displayed.

6. Click the row for your server. A blade for your server is displayed.

7. On your server blade, click **Settings**. The **Settings** blade is displayed.

8. Click **Firewall**. The **Firewall Settings** blade is displayed.

	![Click Settings > Firewall][b31-SettingsFirewallNavig]

9. Click **Add Client IP**. Type in a name for your new rule into the first text box.

10. Type in the low and high IP address values for the range you want to enable.
	- It can be handy to have the low value end with **.0** and the high with **.255**.

	![Add an IP address range to allow][b41-AddRange]

11. Click **Save**.



<!-- Image references. -->

[b21-FindServerInPortal]: ./media/sql-database-include-ip-address-22-v12portal/firewall-ip-b21-v12portal-findsvr.png

[b31-SettingsFirewallNavig]: ./media/sql-database-include-ip-address-22-v12portal/firewall-ip-b31-v12portal-settingsfirewall.png

[b41-AddRange]: ./media/sql-database-include-ip-address-22-v12portal/firewall-ip-b41-v12portal-addrange.png



<!--
These includes/ files are a sequenced set, but you can pick and choose:

includes/sql-database-include-ip-address-22-v12portal.md
? includes/sql-database-include-ip-address-*.md
-->
