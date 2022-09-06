---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 09/05/2022
 ms.author: allensu
 ms.custom: include file
---

## <a name="os-config"></a>Add IP addresses to a VM operating system

Connect and sign in to a VM you created with multiple private IP addresses. You must manually add all the private IP addresses, including the primary, that you added to the VM. Complete the following steps for your VM operating system.

### Windows Server

<details>
  <summary>Expand</summary>

1. Open a command prompt or PowerShell.

2. Enter **`ipconfig /all`** at the command line. You'll see the **Primary** private IP address that was assigned through DHCP.

3. Enter **`ncpa.cpl`** at the command line to open the **Network Connections** configuration.

4. Open the **Properties** for the network adapter assigned the new IP addresses.

5. Double-click **Internet Protocol Version 4 (TCP/IPv4)**.

6. Select **Use the following IP address:**. Enter the following values.

    | Setting | Value |
    | ------- | ----- |
    | **IP address:** | Enter the **Primary** private IP address. |
    | **Subnet mask:** | Enter a subnet mask based on your IP address. </br> For example, if the subnet is a **/24** subnet then the subnet mask is **255.255.255.0**. |
    | **Default gateway:** | The first IP address in the subnet. </br> If your subnet is **10.0.0.0/24**, then the gateway IP address is **10.0.0.1**. |

7. Select **Use the following DNS server addresses:**. Enter the following values.

    | Setting | Value |
    | ------- | ----- |
    | **Preferred DNS server:** | Enter your primary DNS server. </br> Enter the IP address of **168.63.129.16** to use the default Azure provided DNS. |

8. Select the **Advanced** button.

9. Select **Add**.

10. Enter the private **IP address** you added to the Azure network interface. Enter the corresponding **Subnet mask**. Select **Add**.

11. Repeat the previous steps to add any additional private IP addresses that you added to the Azure network interface.

> [!IMPORTANT]
> You should never manually assign the public IP address assigned to an Azure virtual machine within the virtual machine's operating system. When you manually set the IP address within the operating system, ensure that it's the same address as the private IP address assigned to the Azure network interface. Failure to assign the address correctly can cause loss of connectivity to the virtual machine. For more information, see [Change IP address settings](../articles/virtual-network/ip-services/virtual-network-network-interface-addresses.md#change-ip-address-settings).
>
For more information about private IP addresses, see [Private IP address](../articles/virtual-network/ip-services/virtual-network-network-interface-addresses.md#private).

12. Select **OK** to close the secondary IP address settings.

13. Select **OK** to close the adapter settings. Your RDP connection will re-establish.

14. Open a command prompt or PowerShell.

15. Enter **`ipconfig /all`** at the command line.

16. Verify the primary and secondary private IP addresses have been added to the configuration.

    ```powershell
    PS C:\Users\azureuser> ipconfig /all

    Windows IP Configuration

       Host Name . . . . . . . . . . . . : myVM
       Primary Dns Suffix  . . . . . . . :
       Node Type . . . . . . . . . . . . : Hybrid
       IP Routing Enabled. . . . . . . . : No
       WINS Proxy Enabled. . . . . . . . : No

    Ethernet adapter Ethernet:

       Connection-specific DNS Suffix  . :
       Description . . . . . . . . . . . : Microsoft Hyper-V Network Adapter
       Physical Address. . . . . . . . . : 00-0D-3A-E6-CE-A3
       DHCP Enabled. . . . . . . . . . . : No
       Autoconfiguration Enabled . . . . : Yes
       Link-local IPv6 Address . . . . . : fe80::a8d1:11d5:3ab2:6a51%5(Preferred)
       IPv4 Address. . . . . . . . . . . : 10.1.0.4(Preferred)
       Subnet Mask . . . . . . . . . . . : 255.255.255.0
       IPv4 Address. . . . . . . . . . . : 10.1.0.5(Preferred)
       Subnet Mask . . . . . . . . . . . : 255.255.255.0
       IPv4 Address. . . . . . . . . . . : 10.1.0.6(Preferred)
       Subnet Mask . . . . . . . . . . . : 255.255.255.0
       Default Gateway . . . . . . . . . : 10.1.0.1
       DHCPv6 IAID . . . . . . . . . . . : 100666682
       DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-2A-A8-26-B1-00-0D-3A-E6-CE-A3
       DNS Servers . . . . . . . . . . . : 168.63.129.16
       NetBIOS over Tcpip. . . . . . . . : Enabled
    ```

17. Ensure the primary private IP address used in windows is the same as the primary IP address of the Azure VM network interface. For more information, see [No Internet access from Azure Windows VM that has multiple IP addresses](https://support.microsoft.com/help/4040882/no-internet-access-from-azure-windows-vm-that-has-multiple-ip-addresse).

#### Validation (Windows Server)

To validate connectivity to the internet from the secondary IP configuration via the public IP, use the following command. Replace 10.1.0.5 with the secondary private IP address you added to the Azure VM network interface.

```powershell
ping -S 10.1.0.5 outlook.com
```
 
> [!NOTE]
> For secondary IP configurations, you can ping to the Internet if the configuration has a public IP address associated with it. For primary IP configurations, a public IP address is not required to ping to the Internet.

</details>

### Linux (Ubuntu 14/16)

<details>
  <summary>Expand</summary>

We recommend looking at the latest documentation for your Linux distribution. 

1. Open a terminal window.
2. Make sure you're the root user. If you aren't, enter the following command:

   ```bash
   sudo -i
   ```

3. Update the configuration file of the network interface (assuming ‘eth0’).

   * Keep the existing line item for dhcp. The primary IP address remains configured as it was previously.
   * Add a configuration for an additional static IP address with the following commands:

     ```bash
     cd /etc/network/interfaces.d/
     ls
     ```

     You should see a .cfg file.
4. Open the file. You should see the following lines at the end of the file:

   ```bash
   auto eth0
   iface eth0 inet dhcp
   ```

5. Add the following lines after the lines that exist in this file:

   ```bash
   iface eth0 inet static
   address <your private IP address here>
   netmask <your subnet mask>
   ```

6. Save the file by using the following command:

   ```bash
   :wq
   ```

7. Reset the network interface with the following command:

   ```bash
   sudo ifdown eth0 && sudo ifup eth0
   ```

   > [!IMPORTANT]
   > Run both ifdown and ifup in the same line if using a remote connection.
   >

8. Verify the IP address is added to the network interface with the following command:

   ```bash
   ip addr list eth0
   ```

   You should see the IP address you added as part of the list.

#### Validation (Ubuntu 14/16)

To ensure you're able to connect to the internet from your secondary IP configuration via the public IP associated it, use the following command:

```bash
ping -I 10.0.0.5 outlook.com
```

> [!NOTE]
> For secondary IP configurations, you can only ping to the Internet if the configuration has a public IP address associated with it. For primary IP configurations, a public IP address is not required to ping to the Internet.

For Linux VMs, when trying to validate outbound connectivity from a secondary NIC, you may need to add appropriate routes. There are many ways to do this. Please see appropriate documentation for your Linux distribution. The following is one method to accomplish this:

```bash
echo 150 custom >> /etc/iproute2/rt_tables 

ip rule add from 10.0.0.5 lookup custom
ip route add default via 10.0.0.1 dev eth2 table custom
```

- Be sure to replace:
  - **10.0.0.5** with the private IP address that has a public IP address associated to it
  - **10.0.0.1** to your default gateway
  - **eth2** to the name of your secondary NIC

</details>

### Linux (Ubuntu 18.04+)

<details>
  <summary>Expand</summary>

Ubuntu 18.04 and above have changed to `netplan` for OS network management. We recommend looking at the latest documentation for your Linux distribution. 

1. Open a terminal window.
2. Make sure you're the root user. If you are not, enter the following command:

    ```bash
    sudo -i
    ```

3. Create a file for the second interface and open it in a text editor:

    ```bash
    vi /etc/netplan/60-static.yaml
    ```

4. Add the following lines to the file, replacing `10.0.0.6/24` with your IP/netmask:

    ```bash
    network:
        version: 2
        ethernets:
            eth0:
                addresses:
                    - 10.0.0.6/24
    ```

5. Save the file by using the following command:

    ```bash
    :wq
    ```

6. Test the changes using [netplan try](https://manpages.ubuntu.com/manpages/kinetic/en/man8/netplan-try.8.html) to confirm syntax:

    ```bash
    netplan try
    ```

    > [!NOTE]
    > `netplan try` will apply the changes temporarily and roll the changes back after 120 seconds. If there is a loss of connectivity, please wait 120 seconds, and then reconnect. At that time, the changes will have been rolled back.

7. Assuming no issues with `netplan try`, apply the configuration changes:

    ```bash
    netplan apply
    ```

8. Verify the IP address is added to the network interface with the following command:

    ```bash
    ip addr list eth0
    ```

    You should see the IP address you added as part of the list. Example:

    ```bash
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
        inet 127.0.0.1/8 scope host lo
        valid_lft forever preferred_lft forever
        inet6 ::1/128 scope host
        valid_lft forever preferred_lft forever
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
        link/ether 00:0d:3a:8c:14:a5 brd ff:ff:ff:ff:ff:ff
        inet 10.0.0.6/24 brd 10.0.0.255 scope global eth0
        valid_lft forever preferred_lft forever
        inet 10.0.0.4/24 brd 10.0.0.255 scope global secondary eth0
        valid_lft forever preferred_lft forever
        inet6 fe80::20d:3aff:fe8c:14a5/64 scope link
        valid_lft forever preferred_lft forever
    ```

#### Validation (Ubuntu 18.04+)

To ensure you're able to connect to the internet from your secondary IP configuration via the public IP associated it, use the following command:

```bash
ping -I 10.0.0.5 outlook.com
```

>[!NOTE]
>For secondary IP configurations, you can only ping to the Internet if the configuration has a public IP address associated with it. For primary IP configurations, a public IP address is not required to ping to the Internet.

For Linux VMs, when trying to validate outbound connectivity from a secondary NIC, you may need to add appropriate routes. There are many ways to do this. Please see appropriate documentation for your Linux distribution. The following is one method to accomplish this:

```bash
echo 150 custom >> /etc/iproute2/rt_tables 

ip rule add from 10.0.0.5 lookup custom
ip route add default via 10.0.0.1 dev eth2 table custom
```

- Be sure to replace:
  - **10.0.0.5** with the private IP address that has a public IP address associated to it
  - **10.0.0.1** to your default gateway
  - **eth2** to the name of your secondary NIC

</details>

### Linux (Red Hat, CentOS, and others)

<details>
  <summary>Expand</summary>

1. Open a terminal window.
2. Make sure you're the root user. If you are not, enter the following command:

    ```bash
    sudo -i
    ```

3. Enter your password and follow instructions as prompted. Once you're the root user, navigate to the network scripts folder with the following command:

    ```bash
    cd /etc/sysconfig/network-scripts
    ```

4. List the related ifcfg files using the following command:

    ```bash
    ls ifcfg-*
    ```

    You should see *ifcfg-eth0* as one of the files.

5. To add an IP address, create a configuration file for it as shown below. Note that one file must be created for each IP configuration.

    ```bash
    touch ifcfg-eth0:0
    ```

6. Open the *ifcfg-eth0:0* file with the following command:

    ```bash
    vi ifcfg-eth0:0
    ```

7. Add content to the file, *eth0:0* in this case, with the following command. Be sure to update information based on your IP address.

    ```bash
    DEVICE=eth0:0
    BOOTPROTO=static
    ONBOOT=yes
    IPADDR=192.168.101.101
    NETMASK=255.255.255.0
    ```

8. Save the file with the following command:

    ```bash
    :wq
    ```

9. Restart the network services and make sure the changes are successful by running the following commands:

    ```bash
    /etc/init.d/network restart
    ifconfig
    ```

    You should see the IP address you added, *eth0:0*, in the list returned.

#### Validation (Red Hat, CentOS, and others)

To ensure you're able to connect to the internet from your secondary IP configuration via the public IP associated it, use the following command:

```bash
ping -I 10.0.0.5 outlook.com
```
>[!NOTE]
>For secondary IP configurations, you can only ping to the Internet if the configuration has a public IP address associated with it. For primary IP configurations, a public IP address is not required to ping to the Internet.

For Linux VMs, when trying to validate outbound connectivity from a secondary NIC, you may need to add appropriate routes. There are many ways to do this. Please see appropriate documentation for your Linux distribution. The following is one method to accomplish this:

```bash
echo 150 custom >> /etc/iproute2/rt_tables 

ip rule add from 10.0.0.5 lookup custom
ip route add default via 10.0.0.1 dev eth2 table custom
```

- Be sure to replace:
  - **10.0.0.5** with the private IP address that has a public IP address associated to it
  - **10.0.0.1** to your default gateway
  - **eth2** to the name of your secondary NIC


</details>

### Debian GNU/Linux

<details>
  <summary>Expand</summary>

1. Open a terminal window.
1. Make sure you're the root user. If you are not, enter the following command:

   ```bash
   sudo -i
   ```

1. Update the configuration file of the network interface (assuming ‘eth0’).

   * Open the network interface file using below command:

     ```bash
     vi /etc/network/interfaces
     ```

   * You should see the following lines at the end of the file:

      ```bash
      auth eth0
      iface eth0 inet dhcp
      ```

   * Keep the existing line item for dhcp as it is. The primary IP address remains configured as it was previously.
   * Add the following lines after the lines that exist in this file:

     ```bash
     iface eth0 inet static
     address <your private IP address here> 
     netmask <your subnet mask> 
     ```

1. Save the file by using the following command:

   ```bash
   :wq! 
   ```

1. Restart networking services for the changes to take effect. For Debian 8 and above, this can be done using below command :

   ```bash
   systemctl restart networking
   ```
   For prior versions of Debian, you can use below commands:

   ```bash
   service networking restart
   ```

1. Verify that the IP address is added to the network interface with the following command:

   ```bash
   ip addr list eth0
    ```

You should see the IP address you added as part of the list. Example:

```bash
 1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
  link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
  inet 127.0.0.1/8 scope host lo
     valid_lft forever preferred_lft forever
  inet6 ::1/128 scope host
     valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
  link/ether 00:0d:3a:1d:1d:64 brd ff:ff:ff:ff:ff:ff
  inet 10.2.0.5/24 brd 10.2.0.255 scope global eth0
     valid_lft forever preferred_lft forever
  inet 10.2.0.6/24 brd 10.2.0.255 scope global secondary eth0
     valid_lft forever preferred_lft forever
  inet6 fe80::20d:3aff:fe1d:1d64/64 scope link
     valid_lft forever preferred_lft forever
 ```

</details>