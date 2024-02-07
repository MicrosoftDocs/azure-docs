---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: load-balancer
 ms.topic: include
 ms.date: 12/04/2023
 ms.author: mbender
 ms.custom: include file
---

## Install IIS

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **lb-VM1** that is located in the **load-balancer-rg** resource group.

1. On the **Overview** page, select **Connect**, then **Bastion**.

1. Select **Use Bastion**.

1. Enter the username and password entered during VM creation.

1. Select **Connect**.

1. On the server desktop, navigate to **Windows Administrative Tools** > **Windows PowerShell**.

1. In the PowerShell Window, run the following commands to:

    * Install the IIS server
    * Remove the default iisstart.htm file
    * Add a new iisstart.htm file that displays the name of the VM:

   ```powershell
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
   ```

1. Close the Bastion session with **lb-VM1**.

1. Repeat steps to install IIS and the updated iisstart.htm file on **lb-VM2**.

## Test the load balancer

1. In the search box at the top of the page, enter **Load balancer**. Select **Load balancers** in the search results.

1. Click the load balancer you created, **load-balancer**. On the **Frontend IP configuration** page for your load balancer, locate the public **IP address**.

1. Copy the public IP address, and then paste it into the address bar of your browser. The custom VM page of the IIS Web server is displayed in the browser.

    :::image type="content" source="./media/load-balancer-test-iis/load-balancer-test.png" alt-text="Screenshot of load balancer test.":::
