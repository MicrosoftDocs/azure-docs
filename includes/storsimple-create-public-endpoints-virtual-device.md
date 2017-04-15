#### To create public endpoints on the virtual device

1. Sign in to the Azure classic portal.
2. Click **Virtual Machines**, and then select the virtual machine that is being used as your virtual device.
3. Click **Endpoints**. The **Endpoints** page lists all endpoints for the virtual machine.
4. Click **Add**. The **Add Endpoint** dialog box appears. Click the arrow to continue.
5. For the **Name**, type the following name for the endpoint: **WinRMHttps**.
6. For the **Protocol**, specify **TCP**.
7. For the **Public Port**, type the port numbers that you want to use for the connection.
8. For the **Private Port**, type **5986**.
9. Click the check mark to create the endpoint.

After the endpoint is created, you can view its details to determine the Public Virtual IP (VIP) address. Record this address.

