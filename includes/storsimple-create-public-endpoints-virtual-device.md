#### To create public endpoints on the virtual device

1. Sign in to the Azure classic portal.

- Click **Virtual Machines**, and then select the virtual machine that is being used as your virtual device.

- Click **Endpoints**. The **Endpoints** page lists all endpoints for the virtual machine.

- Click **Add**. The **Add Endpoint** dialog box appears. Click the arrow to continue.

- For the **Name**, type the following name for the endpoint: **WinRMHttps**.

- For the **Protocol**, specify **TCP**.

- For the **Public Port**, type the port numbers that you want to use for the connection.

- For the **Private Port**, type **5986**.

- Click the check mark to create the endpoint.

After the endpoint is created, you can view its details to determine the Public Virtual IP (VIP) address. Record this address.