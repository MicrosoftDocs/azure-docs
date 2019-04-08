---
title: Perimeter network example – Build a perimeter network to protect applications with a firewall and NSGs | Microsoft Docs
description: Build a perimeter network with a firewall and Network Security Groups (NSGs)
services: virtual-network
documentationcenter: na
author: tracsman
manager: rossort
editor: ''

ms.assetid: c78491c7-54ac-4469-851c-b35bfed0f528
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/01/2016
ms.author: jonor;sivae

---
# Example 2: Build a perimeter network to protect applications with a firewall and NSGs
[Return to the Microsoft cloud services and network security page][HOME]

This example shows how to create a perimeter network (also known as *DMZ*, *demilitarized zone*, and *screened subnet*) with a firewall, four Windows Server computers, and Network Security Groups (NSGs). It includes details about each of the relevant commands to provide a deeper understanding of each step. The "Traffic scenarios" section provides a step-by-step explanation of how traffic proceeds through the layers of defense in the perimeter network. Finally, the "References" section provides the complete code and instructions for how to build this environment to test and experiment with different scenarios.

![Inbound perimeter network with NVA and NSGs][1]

## Environment 
This example is based on a scenario with an Azure subscription that contains these items:

* Two cloud services: FrontEnd001 and BackEnd001.
* A virtual network named CorpNetwork that has two subnets: FrontEnd and BackEnd.
* A single NSG that's applied to both subnets.
* A network virtual appliance: A Barracuda NextGen Firewall connected to the FrontEnd subnet.
* A Windows Server computer that represents an application web server: IIS01.
* Two Windows Server computers that represent application back-end servers: AppVM01 and AppVM02.
* A Windows Server computer that represents a DNS server: DNS01.

> [!NOTE]
> Although this example uses a Barracuda NextGen Firewall, many network virtual appliances could be used.
> 
> 

The PowerShell script in the "References" section of this article builds most of the environment described here. The VMs and virtual networks are built by the script, but those processes aren't described in detail in this document.

To build the environment:

1. Save the network config XML file included in the "References" section (updated with names, locations, and IP addresses to match your scenario).
2. Update the user-defined variables in the PowerShell script to match the environment the script will run against (subscriptions, service names, and so on).
3. Run the script in PowerShell.

> [!NOTE]
> The region specified in the PowerShell script must match the region specified in the network config XML file.
>
>

After the script runs successfully, you can complete these steps:

1. Set up the firewall rules. See the "Firewall rules" section of this article.
2. If you want, you can set up the web server and app server with a simple web application to allow testing with the perimeter network configuration. You can use the two application scripts provided in the "References" section.

The next section explains most of the script's statements that relate to NSGs.

## NSGs
In this example, an NSG group is built and then loaded with six rules.

> [!TIP]
> In general, you should create your specific “Allow” rules first and the more generic “Deny” rules last. The assigned priority controls which rules are evaluated first. After traffic is found that applies to a specific rule, no further rules are evaluated. NSG rules can apply in either the inbound or the outbound direction (from the perspective of the subnet).
> 
> 

Declaratively, these rules are built for inbound traffic:

1. Internal DNS traffic (port 53) is allowed.
2. RDP traffic (port 3389) from the internet to any VM is allowed.
3. HTTP traffic (port 80) from the internet to the NVA (firewall) is allowed.
4. All traffic (all ports) from IIS01 to AppVM01 is allowed.
5. All traffic (all ports) from the internet to the entire virtual network (both subnets) is denied.
6. All traffic (all ports) from the FrontEnd subnet to the BackEnd subnet is denied.

With these rules bound to each subnet, if an HTTP request were inbound from the internet to the web server, both rule 3 (allow) and rule 5 (deny) would seem to apply, but because rule 3 has a higher priority, only it will apply. Rule 5 won't come into play. So the HTTP request will be allowed to the firewall.

If that same traffic was trying to reach the DNS01 server, rule 5 (deny) would be the first to apply, so the traffic wouldn't be allowed to pass to the server. Rule 6 (deny) blocks the FrontEnd subnet from communicating with the BackEnd subnet (except for traffic allowed in rules 1 and 4). This protects the BackEnd network in case an attacker compromises the web application on the FrontEnd. In that case, the attacker would have limited access to the BackEnd “protected” network. (The attacker would be able to access only the resources exposed on the AppVM01 server.)

There's a default outbound rule that allows traffic out to the internet. In this example, we’re allowing outbound traffic and not modifying any outbound rules. To lock down traffic in both directions, you need user-defined routing. You can learn about this technique in a different example in the [main security boundary document][HOME].

The NSG rules described here are similar to the NSG rules in [Example 1 - Build a simple DMZ with NSGs][Example1]. Review the NSG description in that article for a detailed look at each NSG rule and its attributes.

## Firewall rules
You need to install a management client on a computer to manage the firewall and create the configurations needed. See the documentation from your firewall (or other NVA) vendor about how to manage the device. The rest of this section describes the configuration of the firewall itself, through the vendor's management client (not the Azure portal or PowerShell).

See [Barracuda NG Admin](https://techlib.barracuda.com/NG61/NGAdmin) for instructions for client download and connecting to the Barracuda firewall used in this example.

You need to create forwarding rules on the firewall. Because the scenario in this example only routes internet traffic inbound to the firewall and then to the web server, you only need one forwarding NAT rule. On the Barracuda firewall used in this example, the rule would be a Destination NAT rule (Dst NAT) to pass this traffic.

To create the following rule (or to verify existing default rules), complete these steps:
1. In the Barracuda NG Admin client dashboard, on the configuration tab, in the **Operational Configuration** section, select **Ruleset**. 

   A grid called **Main Rules** shows the existing active and deactivated rules on the firewall.

2. To create a new rule, select the small green **+** button in the upper-right corner of this grid. (Your firewall might be locked. If you see a button marked **Lock** and are unable to create or edit rules, select the button to unlock the ruleset and allow editing.)
  
3. To edit an existing rule, select the rule, right-click, and then select **Edit Rule**.

Create a new rule named something like **WebTraffic.** 

The Destination NAT rule icon looks like this: ![Destination NAT icon][2]

The rule itself will look something like this:

![Firewall rule][3]

Any inbound address that hits the firewall trying to reach HTTP (port 80, or 443 for HTTPS) will be sent out of the firewall’s DHCP1 Local IP interface and redirected to the web server with the IP address 10.0.1.5. Because the traffic is coming in on port 80 and going to the web server on port 80, no port change is needed. But the Target List could have been 10.0.1.5:8080 if the web server listened on port 8080, which would translate the inbound port 80 on the firewall to inbound port 8080 on the web server.

You should also specify a connection method. For the Destination rule from the internet, Dynamic SNAT is most appropriate method.

Even though you've only created one rule, it's important to set its priority correctly. In the grid of all rules on the firewall, if this new rule is at the bottom (below the BLOCKALL rule), it will never come into play. Make sure the new rule for web traffic is above the BLOCKALL rule.

After the rule is created, you need to push it to the firewall and then activate it. If you don't take these steps, the rule change won't take effect. The next section describes the push and activation process.

## Rule activation
Now that the rule is added to the ruleset, you need to upload the ruleset to the firewall and activate it.

![Firewall rule activation][4]

In the upper-right corner of the management client, you'll see a group of buttons. Select **Send Changes** to send the modified ruleset to the firewall, and then select **Activate**.

Now that you've activated the firewall ruleset, the environment is complete. If you want, you can run the sample application scripts in the "References" section to add an application to the environment. If you add an application, you can test the traffic scenarios described in the next section.

> [!IMPORTANT]
> You should realize that you won't hit the web server directly. When a browser requests an HTTP page from FrontEnd001.CloudApp.Net, the HTTP endpoint (port 80) passes the traffic to the firewall, not to the web server. The firewall then, because of the rule you created earlier, uses NAT to map the request to the web server.
> 
> 

## Traffic scenarios
#### (Allowed) Web to web server through the firewall
1. An internet user requests an HTTP page from FrontEnd001.CloudApp.Net (an internet-facing cloud service).
2. The cloud service passes traffic through an open endpoint on port 80 to the firewall's local interface on 10.0.1.4:80.
3. The FrontEnd subnet starts inbound rule processing:
   1. NSG rule 1 (DNS) doesn’t apply. Move to the next rule.
   2. NSG rule 2 (RDP) doesn’t apply. Move to the next rule.
   3. NSG rule 3 (internet to firewall) does apply. Allow traffic. Stop rule processing.
4. Traffic hits the internal IP address of the firewall (10.0.1.4).
5. A firewall forwarding rule determines that this is port 80 traffic and redirects it to web server IIS01.
6. IIS01 is listening for web traffic, receives the request, and starts processing the request.
7. IIS01 requests information from the SQL Server instance on AppVM01.
8. There are no outbound rules on the FrontEnd subnet, so traffic is allowed.
9. The BackEnd subnet starts inbound rule processing:
   1. NSG rule 1 (DNS) doesn’t apply. Move to the next rule.
   2. NSG rule 2 (RDP) doesn’t apply. Move to the next rule.
   3. NSG rule 3 (internet to firewall) doesn’t apply. Move to the next rule.
   4. NSG rule 4 (IIS01 to AppVM01) does apply. Allow traffic. Stop rule processing.
10. The SQL Server instance on AppVM01 receives the request and responds.
11. Because there are no outbound rules on the BackEnd subnet, the response is allowed.
12. The FrontEnd subnet starts inbound rule processing:
    1. There is no NSG rule that applies to inbound traffic from the BackEnd subnet to the FrontEnd subnet, so none of the NSG rules apply.
    2. The default system rule allowing traffic between subnets allows this traffic, so traffic is allowed.
13. IIS01 receives the response from AppVM01, completes the HTTP response, and sends it to the requestor.
14. Because this is a NAT session from the firewall, the response destination is initially for the firewall.
15. The firewall receives the response from the web server and forwards it back to the internet user.
16. Because there are no outbound rules on the FrontEnd subnet, the response is allowed, and the internet user receives the web page.

#### (Allowed) RDP to BackEnd
1. A server admin on the internet requests an RDP session to AppVM01 on BackEnd001.CloudApp.Net:*xxxxx*, where *xxxxx* is the randomly assigned port number for RDP to AppVM01. (You can find the assigned port on the Azure portal or by using PowerShell.)
2. Because the firewall is listening only on the FrontEnd001.CloudApp.Net address, it's not involved with this traffic flow.
3. The BackEnd subnet starts inbound rule processing:
   1. NSG rule 1 (DNS) doesn’t apply. Move to the next rule.
   2. NSG rule 2 (RDP) does apply. Allow traffic. Stop rule processing.
4. Because there are no outbound rules, the default rules apply and return traffic is allowed.
5. The RDP session is enabled.
6. AppVM01 prompts for a user name and password.

#### (Allowed) Web server DNS lookup on DNS server
1. The web server, IIS01, needs a data feed at www.data.gov but needs to resolve the address.
2. The network configuration for the virtual network shows DNS01 (10.0.2.4 on the BackEnd subnet) as the primary DNS server. IIS01 sends the DNS request to DNS01.
3. Because there are no outbound rules on the FrontEnd subnet, traffic is allowed.
4. The BackEnd subnet starts inbound rule processing:
   1. NSG rule 1 (DNS) applies. Allow traffic. Stop rule processing.
5. The DNS server receives the request.
6. The DNS server doesn’t have the address cached and queries a root DNS server on the internet.
7. Because there are no outbound rules on the BackEnd subnet, traffic is allowed.
8. The internet DNS server responds. Because the session was initiated internally, the response is allowed.
9. The DNS server caches the response and responds to the request from IIS01.
10. Because there are no outbound rules on the BackEnd subnet, traffic is allowed.
11. The FrontEnd subnet starts inbound rule processing:
    1. There is no NSG rule that applies to inbound traffic from the BackEnd subnet to the FrontEnd subnet, so none of the NSG rules apply.
    2. The default system rule allowing traffic between subnets allows this traffic, so the traffic is allowed.
12. IIS01 receives the response from DNS01.

#### (Allowed) Web server file access on AppVM01
1. IIS01 requests a file on AppVM01.
2. Because there are no outbound rules on the FrontEnd subnet, traffic is allowed.
3. The BackEnd subnet starts inbound rule processing:
   1. NSG rule 1 (DNS) doesn’t apply. Move to the next rule.
   2. NSG rule 2 (RDP) doesn’t apply. Move to the next rule.
   3. NSG rule 3 (internet to firewall) doesn’t apply. Move to the next rule.
   4. NSG rule 4 (IIS01 to AppVM01) does apply. Allow traffic. Stop rule processing.
4. AppVM01 receives the request and responds with the file (assuming access is authorized).
5. Because there are no outbound rules on the BackEnd subnet, the response is allowed.
6. The FrontEnd subnet starts inbound rule processing:
   1. There is no NSG rule that applies to inbound traffic from the BackEnd subnet to the FrontEnd subnet, so none of the NSG rules apply.
   2. The default system rule allowing traffic between subnets allows this traffic, so the traffic is allowed.
7. IIS01 receives the file.

#### (Denied) Web direct to web server
Because the web server IIS01 and the firewall are in the same cloud service, they share the same public-facing IP address. So any HTTP traffic is directed to the firewall. While a request would be successfully served, it can't go directly to the web server. It passes, as designed, through the firewall first. See the first scenario in this section for the traffic flow.

#### (Denied) Web to BackEnd server
1. An internet user tries to access a file on AppVM01 through the BackEnd001.CloudApp.Net service.
2. Because there are no endpoints open for file sharing, this won't pass the cloud service and won't reach the server.
3. If the endpoints are open for some reason, NSG rule 5 (internet to virtual network) blocks the traffic.

#### (Denied) Web DNS lookup on the DNS server
1. An internet user tries to look up an internal DNS record on DNS01 through the BackEnd001.CloudApp.Net service.
2. Because there are no endpoints open for DNS, this won't pass the cloud service and won’t reach the server.
3. If the endpoints are open for some reason, NSG rule 5 (internet to virtual network) blocks the traffic. (Rule 1 [DNS] doesn't apply for two reasons. First, the source address is the internet, and this rule applies only when the local virtual network is the source. Second, this rule is an Allow rule, so it never denies traffic.)

#### (Denied) Web to SQL access through the firewall
1. An internet user requests SQL data from FrontEnd001.CloudApp.Net (an internet-facing cloud service).
2. Because there are no endpoints open for SQL, this won't pass the cloud service and won't reach the firewall.
3. If the endpoints are open for some reason, the FrontEnd subnet starts inbound rule processing:
   1. NSG rule 1 (DNS) doesn’t apply. Move to the next rule.
   2. NSG rule 2 (RDP) doesn’t apply. Move to the next rule.
   3. NSG rule 3 (internet to firewall) does apply. Allow traffic. Stop rule processing.
4. Traffic hits the internal IP address of the firewall (10.0.1.4).
5. The firewall has no forwarding rules for SQL and drops the traffic.

## Conclusion
This example shows a relatively straightforward way to protect your application with a firewall and isolate the back-end subnet from inbound traffic.

You can find more examples and an overview of network security boundaries [here][HOME].

## References
### Full script and network config
Save the full script in a PowerShell script file. Save the network config script in a file named NetworkConf2.xml.
Change the user defined-variables as needed. Run the script, and then follow the instructions in the "Firewall rules" section of this article.

#### Full script
This script, based on the user-defined variables, will complete the following steps:

1. Connect to an Azure subscription.
2. Create a storage account.
3. Create a virtual network and two subnets, as defined in the network config file.
4. Build four Windows Server VMs.
5. Configure NSG. Configuration completes these steps:
   * Creates an NSG.
   * Populates the NSG with rules.
   * Binds the NSG to the appropriate subnets.

You should run this PowerShell script locally on an internet-connected computer or server.

> [!IMPORTANT]
> When you run this script, warnings and other informational messages might appear in PowerShell. You only need to be concerned about error messages that appear in red.
> 
> 

```powershell
    <# 
     .SYNOPSIS
      Example of a perimeter network and Network Security Groups in an isolated network. (Azure only. No hybrid connections.)

     .DESCRIPTION
      This script will build out a sample perimeter network setup containing:
       - A default storage account for VM disks.
       - Two new cloud services.
       - Two subnets (the FrontEnd and BackEnd subnets).
       - A network virtual appliance (NVA): a Barracuda NextGen Firewall.
       - One server on the FrontEnd subnet (plus the NVA on the FrontEnd subnet).
       - Three servers on the BackEnd subnet.
       - Network Security Groups to allow/deny traffic patterns as declared.

      Before running the script, ensure the network configuration file is created in
      the directory referenced by the $NetworkConfigFile variable (or update the
      variable to reflect the path and file name of the config file being used).

     .Notes
      Security requirements are different for each use case and can be addressed in many ways. Be sure that any sensitive data or applications are behind
      the appropriate layer(s) of protection. This script serves as an example of some
      of the techniques that you can use, but it should not be used for all scenarios. You
      are responsible for assessing your security needs and the appropriate protections
      and then effectively implementing those protections.

      FrontEnd Service (FrontEnd subnet 10.0.1.0/24)
       myFirewall - 10.0.1.4
       IIS01      - 10.0.1.5

      BackEnd Service (BackEnd subnet 10.0.2.0/24)
       DNS01      - 10.0.2.4
       AppVM01    - 10.0.2.5
       AppVM02    - 10.0.2.6

    #>

    # Fixed Variables
        $LocalAdminPwd = Read-Host -Prompt "Enter Local Admin Password to be used for all VMs"
        $VMName = @()
        $ServiceName = @()
        $VMFamily = @()
        $img = @()
        $size = @()
        $SubnetName = @()
        $VMIP = @()

    # User-Defined Global Variables
      # These should be changed to reflect your subscription and services.
      # Invalid options will fail in the validation section.

      # Subscription Access Details
        $subID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

      # VM Account, Location, and Storage Details
        $LocalAdmin = "theAdmin"
        $DeploymentLocation = "Central US"
        $StorageAccountName = "vmstore02"

      # Service Details
        $FrontEndService = "FrontEnd001"
        $BackEndService = "BackEnd001"

      # Network Details
        $VNetName = "CorpNetwork"
        $FESubnet = "FrontEnd"
        $FEPrefix = "10.0.1.0/24"
        $BESubnet = "BackEnd"
        $BEPrefix = "10.0.2.0/24"
        $NetworkConfigFile = "C:\Scripts\NetworkConf2.xml"

      # VM Base Disk Image Details
        $SrvImg = Get-AzureVMImage | Where {$_.ImageFamily -match 'Windows Server 2012 R2 Datacenter'} | sort PublishedDate -Descending | Select ImageName -First 1 | ForEach {$_.ImageName}
        $FWImg = Get-AzureVMImage | Where {$_.ImageFamily -match 'Barracuda NextGen Firewall'} | sort PublishedDate -Descending | Select ImageName -First 1 | ForEach {$_.ImageName}

      # NSG Details
        $NSGName = "MyVNetSG"

    # User-Defined VM-Specific Config
        # To ensure proper NSG rule creation later in this script:
        #       - The web server must be VM 1.
        #       - The AppVM1 server must be VM 2.
        #       - The DNS server must be VM 4.
        #
        #       Otherwise the NSG rules in the last section of this
        #       script will need to be changed to match the modified
        #       VM array numbers ($i) so the NSG rule IP addresses
        #       are aligned to the associated VM IP addresses.

        # VM 0 - The Network Virtual Appliance (NVA)
          $VMName += "myFirewall"
          $ServiceName += $FrontEndService
          $VMFamily += "Firewall"
          $img += $FWImg
          $size += "Small"
          $SubnetName += $FESubnet
          $VMIP += "10.0.1.4"

        # VM 1 - The Web Server
          $VMName += "IIS01"
          $ServiceName += $FrontEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $FESubnet
          $VMIP += "10.0.1.5"

        # VM 2 - The First Application Server
          $VMName += "AppVM01"
          $ServiceName += $BackEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $BESubnet
          $VMIP += "10.0.2.5"

        # VM 3 - The Second Application Server
          $VMName += "AppVM02"
          $ServiceName += $BackEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $BESubnet
          $VMIP += "10.0.2.6"

        # VM 4 - The DNS Server
          $VMName += "DNS01"
          $ServiceName += $BackEndService
          $VMFamily += "Windows"
          $img += $SrvImg
          $size += "Standard_D3"
          $SubnetName += $BESubnet
          $VMIP += "10.0.2.4"

    # ----------------------------- #
    # No user-defined variables or   #
    # configuration past this point #
    # ----------------------------- #

      # Get your Azure accounts
        Add-AzureAccount
        Set-AzureSubscription –SubscriptionId $subID -ErrorAction Stop
        Select-AzureSubscription -SubscriptionId $subID -Current -ErrorAction Stop

      # Create storage account
        If (Test-AzureName -Storage -Name $StorageAccountName) { 
            Write-Host "Fatal Error: This storage account name is already in use, please pick a diffrent name." -ForegroundColor Red
            Return}
        Else {Write-Host "Creating Storage Account" -ForegroundColor Cyan 
              New-AzureStorageAccount -Location $DeploymentLocation -StorageAccountName $StorageAccountName}

      # Update subscription pointer to new storage account
        Write-Host "Updating Subscription Pointer to New Storage Account" -ForegroundColor Cyan 
        Set-AzureSubscription –SubscriptionId $subID -CurrentStorageAccountName $StorageAccountName -ErrorAction Stop

    # Validation
    $FatalError = $false

    If (-Not (Get-AzureLocation | Where {$_.DisplayName -eq $DeploymentLocation})) {
         Write-Host "This Azure Location was not found or available for use" -ForegroundColor Yellow
         $FatalError = $true}

    If (Test-AzureName -Service -Name $FrontEndService) { 
        Write-Host "The FrontEndService service name is already in use, please pick a different service name." -ForegroundColor Yellow
        $FatalError = $true}
    Else { Write-Host "The FrontEndService service name is valid for use." -ForegroundColor Green}

    If (Test-AzureName -Service -Name $BackEndService) { 
        Write-Host "The BackEndService service name is already in use, please pick a different service name." -ForegroundColor Yellow
        $FatalError = $true}
    Else { Write-Host "The BackEndService service name is valid for use." -ForegroundColor Green}

    If (-Not (Test-Path $NetworkConfigFile)) { 
        Write-Host 'The network config file was not found, please update the $NetworkConfigFile variable to point to the network config xml file.' -ForegroundColor Yellow
        $FatalError = $true}
    Else { Write-Host "The network config file was found" -ForegroundColor Green
            If (-Not (Select-String -Pattern $DeploymentLocation -Path $NetworkConfigFile)) {
                Write-Host 'The deployment location was not found in the network config file, please check the network config file to ensure the $DeploymentLocation variable is correct and the network config file matches.' -ForegroundColor Yellow
                $FatalError = $true}
            Else { Write-Host "The deployment location was found in the network config file." -ForegroundColor Green}}

    If ($FatalError) {
        Write-Host "A fatal error has occurred, please see the above messages for more information." -ForegroundColor Red
        Return}
    Else { Write-Host "Validation passed, now building the environment." -ForegroundColor Green}

    # Create virtual network
        Write-Host "Creating VNET" -ForegroundColor Cyan 
        Set-AzureVNetConfig -ConfigurationPath $NetworkConfigFile -ErrorAction Stop

    # Create services
        Write-Host "Creating Services" -ForegroundColor Cyan
        New-AzureService -Location $DeploymentLocation -ServiceName $FrontEndService -ErrorAction Stop
        New-AzureService -Location $DeploymentLocation -ServiceName $BackEndService -ErrorAction Stop

    # Build VMs
        $i=0
        $VMName | Foreach {
            Write-Host "Building $($VMName[$i])" -ForegroundColor Cyan
            If ($VMFamily[$i] -eq "Firewall") 
                { 
                New-AzureVMConfig -Name $VMName[$i] -ImageName $img[$i] –InstanceSize $size[$i] | `
                    Add-AzureProvisioningConfig -Linux -LinuxUser $LocalAdmin -Password $LocalAdminPwd  | `
                    Set-AzureSubnet  –SubnetNames $SubnetName[$i] | `
                    Set-AzureStaticVNetIP -IPAddress $VMIP[$i] | `
                    New-AzureVM –ServiceName $ServiceName[$i] -VNetName $VNetName -Location $DeploymentLocation
                # Set up all the endpoints we'll need once we're up and running.
                # Note: Web traffic goes through the firewall, so we'll need to set up an HTTP endpoint.
                #       Also, the firewall will be redirecting web traffic to a new IP and port in a
                #       forwarding rule, so the HTTP endpoint here will have the same public and local
                #       port and the firewall will do the NATing and redirection as declared in the
                #       firewall rule.
                Add-AzureEndpoint -Name "MgmtPort1" -Protocol tcp -PublicPort 801  -LocalPort 801  -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "MgmtPort2" -Protocol tcp -PublicPort 807  -LocalPort 807  -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                Add-AzureEndpoint -Name "HTTP"      -Protocol tcp -PublicPort 80   -LocalPort 80   -VM (Get-AzureVM -ServiceName $ServiceName[$i] -Name $VMName[$i]) | Update-AzureVM
                # Note: An SSH endpoint is automatically created on port 22 when the appliance is created.
                }
            Else
                {
                New-AzureVMConfig -Name $VMName[$i] -ImageName $img[$i] –InstanceSize $size[$i] | `
                    Add-AzureProvisioningConfig -Windows -AdminUsername $LocalAdmin -Password $LocalAdminPwd  | `
                    Set-AzureSubnet  –SubnetNames $SubnetName[$i] | `
                    Set-AzureStaticVNetIP -IPAddress $VMIP[$i] | `
                    Set-AzureVMMicrosoftAntimalwareExtension -AntimalwareConfiguration '{"AntimalwareEnabled" : true}' | `
                    Remove-AzureEndpoint -Name "PowerShell" | `
                    New-AzureVM –ServiceName $ServiceName[$i] -VNetName $VNetName -Location $DeploymentLocation
                    # Note: A Remote Desktop endpoint is automatically created when each VM is created.
                }
            $i++
        }

    # Configure NSG
        Write-Host "Configuring the Network Security Group (NSG)" -ForegroundColor Cyan

      # Build the NSG
        Write-Host "Building the NSG" -ForegroundColor Cyan
        New-AzureNetworkSecurityGroup -Name $NSGName -Location $DeploymentLocation -Label "Security group for $VNetName subnets in $DeploymentLocation"

      # Add NSG rules
        Write-Host "Writing rules into the NSG" -ForegroundColor Cyan
        Get-AzureNetworkSecurityGroup -Name $NSGName | Set-AzureNetworkSecurityRule -Name "Enable Internal DNS" -Type Inbound -Priority 100 -Action Allow `
            -SourceAddressPrefix VIRTUAL_NETWORK -SourcePortRange '*' `
            -DestinationAddressPrefix $VMIP[4] -DestinationPortRange '53' `
            -Protocol *

        Get-AzureNetworkSecurityGroup -Name $NSGName | Set-AzureNetworkSecurityRule -Name "Enable RDP to $VNetName VNet" -Type Inbound -Priority 110 -Action Allow `
            -SourceAddressPrefix INTERNET -SourcePortRange '*' `
            -DestinationAddressPrefix VIRTUAL_NETWORK -DestinationPortRange '3389' `
            -Protocol *

        Get-AzureNetworkSecurityGroup -Name $NSGName | Set-AzureNetworkSecurityRule -Name "Enable Internet to $($VMName[0])" -Type Inbound -Priority 120 -Action Allow `
            -SourceAddressPrefix Internet -SourcePortRange '*' `
            -DestinationAddressPrefix $VMIP[0] -DestinationPortRange '*' `
            -Protocol *

        Get-AzureNetworkSecurityGroup -Name $NSGName | Set-AzureNetworkSecurityRule -Name "Enable $($VMName[1]) to $($VMName[2])" -Type Inbound -Priority 130 -Action Allow `
            -SourceAddressPrefix $VMIP[1] -SourcePortRange '*' `
            -DestinationAddressPrefix $VMIP[2] -DestinationPortRange '*' `
            -Protocol *

        Get-AzureNetworkSecurityGroup -Name $NSGName | Set-AzureNetworkSecurityRule -Name "Isolate the $VNetName VNet from the Internet" -Type Inbound -Priority 140 -Action Deny `
            -SourceAddressPrefix INTERNET -SourcePortRange '*' `
            -DestinationAddressPrefix VIRTUAL_NETWORK -DestinationPortRange '*' `
            -Protocol *

        Get-AzureNetworkSecurityGroup -Name $NSGName | Set-AzureNetworkSecurityRule -Name "Isolate the $FESubnet subnet from the $BESubnet subnet" -Type Inbound -Priority 150 -Action Deny `
            -SourceAddressPrefix $FEPrefix -SourcePortRange '*' `
            -DestinationAddressPrefix $BEPrefix -DestinationPortRange '*' `
            -Protocol *

        # Assign the NSG to the subnets
            Write-Host "Binding the NSG to both subnets" -ForegroundColor Cyan
            Set-AzureNetworkSecurityGroupToSubnet -Name $NSGName -SubnetName $FESubnet -VirtualNetworkName $VNetName
            Set-AzureNetworkSecurityGroupToSubnet -Name $NSGName -SubnetName $BESubnet -VirtualNetworkName $VNetName

    # Optional Post-Script Manual Configuration
      # Configure firewall
      # Install test web app (run post-build script on the IIS server)
      # Install back-end resources (run post-build script on AppVM01)
      Write-Host
      Write-Host "Build Complete!" -ForegroundColor Green
      Write-Host
      Write-Host "Optional Post-script Manual Configuration Steps" -ForegroundColor Gray
      Write-Host " - Configure Firewall" -ForegroundColor Gray
      Write-Host " - Install Test Web App (Run Post-Build Script on the IIS Server)" -ForegroundColor Gray
      Write-Host " - Install Backend resource (Run Post-Build Script on the AppVM01)" -ForegroundColor Gray
      Write-Host
```

#### Network config file
Save this XML file with updated locations, and then add a link to this file in the $NetworkConfigFile variable in the preceding script.

```xml
    <NetworkConfiguration xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
      <VirtualNetworkConfiguration>
        <Dns>
          <DnsServers>
            <DnsServer name="DNS01" IPAddress="10.0.2.4" />
            <DnsServer name="Level3" IPAddress="209.244.0.3" />
          </DnsServers>
        </Dns>
        <VirtualNetworkSites>
          <VirtualNetworkSite name="CorpNetwork" Location="Central US">
            <AddressSpace>
              <AddressPrefix>10.0.0.0/16</AddressPrefix>
            </AddressSpace>
            <Subnets>
              <Subnet name="FrontEnd">
                <AddressPrefix>10.0.1.0/24</AddressPrefix>
              </Subnet>
              <Subnet name="BackEnd">
                <AddressPrefix>10.0.2.0/24</AddressPrefix>
              </Subnet>
            </Subnets>
            <DnsServersRef>
              <DnsServerRef name="DNS01" />
              <DnsServerRef name="Level3" />
            </DnsServersRef>
          </VirtualNetworkSite>
        </VirtualNetworkSites>
      </VirtualNetworkConfiguration>
    </NetworkConfiguration>
```

#### Sample application scripts
If you want to install a sample application for this and other perimeter network examples, see the [sample application script][SampleApp].

<!--Image References-->
[1]: ./media/virtual-networks-dmz-nsg-fw-asm/example2design.png "Inbound DMZ with NSG"
[2]: ./media/virtual-networks-dmz-nsg-fw-asm/dstnaticon.png "Destination NAT Icon"
[3]: ./media/virtual-networks-dmz-nsg-fw-asm/firewallrule.png "Firewall Rule"
[4]: ./media/virtual-networks-dmz-nsg-fw-asm/firewallruleactivate.png "Firewall Rule Activation"

<!--Link References-->
[HOME]: ../best-practices-network-security.md
[SampleApp]: ./virtual-networks-sample-app.md
[Example1]: ./virtual-networks-dmz-nsg-asm.md
