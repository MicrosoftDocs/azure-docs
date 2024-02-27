---
title: Configure MTU for Linux Virtual Machines in Azure
titleSuffix: Azure Virtual Network
description: Get started with this how-to article to configure Maximum Transmission Unit (MTU) for Linux in Azure.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 02/27/2024

#customer intent: As a network administrator, I want to change the MTU for my Linux or Windows virtual machine so that I can optimize network performance.

---

# Configure Maximum Transmission Unit (MTU) for Linux Virtual Machines in Azure

The Maximum Transmission Unit, or MTU, is a measurement representing the largest size ethernet frame (packet) that can be transmitted by a network device or interface. If a packet exceeds the largest size accepted by the device, it is fragmented into multiple smaller packets, then later reassembled at the destination. 

Fragmentation and reassembly can introduce performance and ordering issues, resulting in a suboptimal experience. Optimizing MTU for your solution can provide network bandwidth performance benefits by reducing the total number of packets required to send a dataset.  

The MTU is a configurable setting in a virtual machine's operating system. The default value MTU setting in Azure is 1500 bytes. 

VMs in Azure can support larger MTUs than the 1500 byte default only for traffic that stays within the virtual network.

The following table shows the largest MTU size supported on the Azure Network Interfaces available in Azure:

| Operating System | Network Interface | Largest MTU for inter virtual network traffic |
|------------------|-------------------|-----------------------------------------------|
| Linux | Mellanox Cx3, Cx4, Cx5 | 3900 |
| Linux | (Preview) Microsoft Azure Network Adapter | 9000 |

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- A Linux virtual machine in Azure.

## Precautions

- Virtual machines in Azure can support larger MTUs than the 1500 byte default only for traffic that stays within the virtual network. Larger MTUs are not supported for scenarios outside of inter-virtual network and VM-to-VM traffic, such as traffic traversing through gateways, peering’s, or to the internet. Configuring a larger MTU may result in fragmentation and reduction in performance. For traffic utilizing these scenarios we recommend utilizing the default 1500 byte MTU or testing to ensure that a larger MTU is supported across the entire network path. 

- Optimal MTU is Operating System, network, and application specific. The maximal supported MTU may not be optimal for your use case.

- Always test MTU settings changes in a non-critical environment first before applying broadly or to critical environments.

## Path MTU discovery

A shell script is used to determine the largest MTU size that can be used for a specific network path. The script uses ICMP ping to determine the maximum frame size that can be sent between the source and destination.

**Steps**:

1. Set maximum MTU on source and destination address.

1. Run the script to determine the largest MTU size that can be used for a specific network path.

1. Based on the output of the script, adjust the MTU settings appropriately on the source and destination.

## MTU discovery script

Copy and paste the following shell script into a file on your Linux virtual machine named `LinuxVmUtilities.sh`. 

```bash
#!/bin/bash

#Note: to run the script remove initial carriage returns by running command  "sed -i 's/\r//g' LinuxVmUtilities.sh"

ErrorMsg1="Not a valid input"
ErrorMsg2="Not a valid interface"
ErrorMsg3="Provide interface name"
ErrorMsg4="Provide interface name and processors"
ErrorMsg5="Initial ping failed"


#################
#Function to get IRQ for passed interface
#In		: Interface name
#Out	: IRQ list specific to Mellanox and Mana
#################
#How to use this function
# examples
# source LinuxVmUtilities.sh;Get-Irqs enP30832p0s0

function Get-Irqs() {
	ifname=$1
    if [ -z "$ifname" ]
    then
        echo $ErrorMsg1
        echo "provide interface-name"
        return
    fi
	
    s_dir=/sys/class/net/$ifname/device/msi_irqs
    if [ ! -d $s_dir ]
    then
        echo $ErrorMsg2
        return
    fi

    RET=''
    irqs=$(ls $s_dir)

    for irq in ${irqs[@]}; do
        irq_detail=$(ls /proc/irq/$irq/ 2>/dev/null)
        if [[ -z $irq_detail ]]; then continue; fi

        #check interface specific irq's 
        mlx4_comp_ch="$(grep -oP '(?<=mlx4-)[0-9]+(?=@)'<<<$irq_detail)"
        mlx5_comp_ch="$(grep -oP '(?<=mlx5_comp)[0-9]+(?=@pci)'<<<$irq_detail)"
        mana_queue_ch="$(grep -oP '(?<=mana_q)[0-9]+(?=@pci)'<<<$irq_detail)"
        
        if [[ $mlx4_comp_ch ]]; then
            comp_ch=$(( mlx4_comp_ch - 1 ))
        elif [[ $mlx5_comp_ch ]]; then            
            comp_ch=$mlx5_comp_ch
        else
            comp_ch=$mana_queue_ch
        fi
        
        if [[ -z $comp_ch ]]; then continue;fi
        
        RET+=" $irq"
    done
    echo $RET	
}


#Function to get affinity list of passed interface
#In 	: Interface name
#Out 	: smp_affirnity_list 
#################
#How to use this function
# examples
# source LinuxVmUtilities.sh;Get-RssProcessors enP30832p0s0

function Get-RssProcessors() {

	if [ "$#" = 0 ]; then
		echo $ErrorMsg3
        echo "provide interface-name"
		return
	fi
	
    ifname=$1

	s_dir=$home/sys/class/net/$ifname/device/msi_irqs
	RES=''
	if [ -d $s_dir ]; then
		first=1
		#Get valid irqs
		irqs=$(Get-Irqs $1)
		IFS=' ' read -r -a array <<< "$irqs"
		for irq in ${array[@]}; do
			irq_a="$(cat $home/proc/irq/$irq/smp_affinity_list)"
			if [ $first = 1 ];then
				RES+="${irq_a}"
				first=0
			else
				RES+=" ${irq_a}"
			fi
		done
	else
		echo $ErrorMsg2
	fi
	echo $RES
}


#Function to set affinity list of passed interface
#In 	: Interface name, VPs to set the IRQs
#Out 	: update smp_affirnity_list with VP number 
#################
#How to use this function
# examples
# source LinuxVmUtilities.sh;Set-RssIndirectiontable enP45104s1 36 38 40 42 44 46 48 50 52 54 56 58 60 62

function Set-RssIndirectiontable() {	
	if [ "$#" = 0 ]; then
		echo $ErrorMsg4
		return
	elif [ "$#" = 1 ]; then
		echo $ErrorMsg5
		return
	fi

	ifname=$1
	if [ "$ifname" = "lo" ]; then
		echo $ErrorMsg1
		return
	fi
	shift
	
	procs=("$@")
	procIndex=0

	#skip negative value if passed
	for p in ${procs[@]}
        do
                if [ $p -lt 0 ]; then
                        procs=(${procs[@]/$p})
                fi
        done

	#Get melox specifi irqs
	irqs=$(Get-Irqs $ifname)
	#Update  affinity list for gather irqs base on user input
	updated=''
	IFS=' ' read -r -a array <<< "$irqs"
	first=1
	for irq in "${array[@]}" ; do
		su - root -c "echo ${procs[$procIndex]} > /proc/irq/${irq}/smp_affinity_list"
		if [ $first = 1 ];then
			updated+=${procs[$procIndex]}
			first=0
		else
			updated+=" ${procs[$procIndex]}"
		fi
		procIndex=$((procIndex+1))
		if [[ $procIndex -ge ${#procs[@]} ]]; then procIndex=0; fi
	done

	#validate 
	current=$(Get-RssProcessors $ifname)
	if [ "${current}" = "${updated}" ];then 
		echo "Successfully updated Table!"
	else 
		echo "Fail to update Table"
	fi
}

#Function to set affinity list of passed interface
#In 	: destination Ip
#Out 	: Get-PathMtu
#################
#How to use this function
# examples
# source LinuxVmUtilities.sh;Get-PathMtu <destination-ip> <initial-packet-size> <interface-name>
# source LinuxVmUtilities.sh;Get-PathMtu 8.8.8.8 1200 eth0
# note: 
# 1. give initial packet size (1200 in above example) always a successfull ping packet-size
# 2. give correct interface name, code failes if interface name is wrong

function Get-PathMtu() {
    
    destinationIp="$1"
    startSendBufferSize=$2 
    interfaceName="$3" 

	if [[ -z "$interfaceName" ]]; then
		initialPingOutput=$(ping -4 -M do -c 1 -s $startSendBufferSize $destinationIp)
	else
		initialPingOutput=$(ping -4 -M do -c 1 -s $startSendBufferSize $destinationIp -I $interfaceName)
	fi

	if [[ $initialPingOutput = *'0 received'* ]]; then
		echo $ErrorMsg5
		echo "Initial ping should be successfull, check Destination-IP or lower initial size"
		return
	fi

    sendBufferSize=0
    tempPassedBufferSize=$startSendBufferSize
	echo -n "Test started ...."
    while [ $tempPassedBufferSize -ne $sendBufferSize ]; do

        sendBufferSize=$tempPassedBufferSize

        counter=0
        tempSendBufferSize=$sendBufferSize
        successfullBufferSize=$sendBufferSize
        while [ true ]; do
		
            if [[ -z "$interfaceName" ]]; then
                ping -4 -M do -c 1 -s $tempSendBufferSize $destinationIp &> /dev/null
            else
                ping -4 -M do -c 1 -s $tempSendBufferSize $destinationIp -I $interfaceName &> /dev/null
            fi
            
            if [ $? -eq 1 ]
            then
                break
            fi
			echo -n "...."
            successfullBufferSize=$tempSendBufferSize
            tempSendBufferSize=$(($tempSendBufferSize + 2**$counter))
            counter=$(($counter + 1))
        done
        tempPassedBufferSize=$successfullBufferSize
    done
    finalMtuInTopology=$(($sendBufferSize + 28))          
	echo ""
    echo  "$finalMtuInTopology"
}
```

## Change MTU size on a Linux virtual machine

Use the following steps to change the MTU size on a Linux virtual machine:

1. Sign-in to your Linux virtual machine.

1. Copy and paste the `LinuxVmUtilities.sh` script into a file on your Linux virtual machine.

1. Run the following command to make the script executable:

```bash
chmod +x LinuxVmUtilities.sh
```

1. Use the `ip` commmand to show the current network interfaces and their MTU settings:

```bash
ip link show
```

```output
azureuser@vm-linux:~$ ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
3: enP1328s1: <BROADCAST,MULTICAST,SLAVE,UP,LOWER_UP> mtu 1500 qdisc mq master eth0 state UP mode DEFAULT group default qlen 1000
    link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
    altname enP1328p0s2
```

In this example the MTU is set at 1500 and the name of the network interface is **eth0**.

1. Execute the script you copy and pasted earlier to determine the MTU size:

```bash
./LinuxVmUtilities.sh
```

1. 

## Related content

* [Related article title](link.md)
* [Related article title](link.md)
* [Related article title](link.md)
