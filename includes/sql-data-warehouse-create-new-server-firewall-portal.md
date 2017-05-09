### Create a server-level firewall rule in the Azure portal

1. On the SQL server blade, under Settings, click **Firewall** to open the Firewall blade for the SQL server.

    ![sql server firewall](./media/sql-data-warehouse-server-firewall/sql-server-firewall.png)
    
2. Review the client IP address displayed and validate that this is your IP address on the Internet using a browser of your choice (ask "what is my IP address). Occasionally they do not match for a various reasons.

    ![your IP address](../articles/sql-database/media/sql-database-get-started/your-ip-address.png)

3. Assuming that the IP addresses match, click **Add client IP** on the toolbar.

    ![add client IP](./media/sql-data-warehouse-server-firewall/add-client-ip.png)

    > [!NOTE]
    > You can open the firewall on the SQL server (logical server) to a single IP address or an entire range of addresses. Opening the firewall enables SQL administrators and users to login to any database on the server for which they have valid credentials.
    >

4. Click **Save** on the toolbar to save this server-level firewall rule and then click **OK**.

    ![add client IP](../articles/sql-database/media/sql-database-get-started/save-firewall-rule.png)