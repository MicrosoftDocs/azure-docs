---
title: Implement Quality of Service (QoS) for Azure Virtual Desktop
titleSuffix: Azure
description: How to set up QoS for Azure Virtual Desktop.
author: femila
ms.topic: conceptual
ms.date: 10/18/2021
ms.author: femila
---
# Implement Quality of Service (QoS) for Azure Virtual Desktop

[RDP Shortpath for managed networks](./shortpath.md) provides a direct UDP-based transport between Remote Desktop Client and Session host. RDP Shortpath for managed networks enables configuration of Quality of Service (QoS) policies for the RDP data.
QoS in Azure Virtual Desktop allows real-time RDP traffic that's sensitive to network delays to "cut in line" in front of traffic that's less sensitive. Example of such less sensitive traffic would be a downloading a new app, where an extra second to download isn't a large deal. QoS uses Windows Group Policy Objects to identify and mark all packets in real-time streams and help your network to give RDP traffic a dedicated portion of bandwidth.

If you support a large group of users experiencing any of the problems described in this article, you probably need to implement QoS. A small business with few users might not need QoS, but it should be helpful even there.

Without some form of QoS, you might see the following issues:

* Jitter – RDP packets arriving at different rates, which can result in visual and audio glitches
* Packet loss – packets dropped, which results in retransmission that requires additional time
* Delayed round-trip time (RTT) – RDP packets taking a long time to reach their destinations, which result in noticeable delays between input and reaction from the desktop or application.

The least complicated way to address these issues is to increase the data connections' size, both internally and out to the internet. Since that is often cost-prohibitive, QoS provides a way to manage the resources you have instead of adding bandwidth more effectively. To address quality issues, we recommend that you first use QoS, then add bandwidth only where necessary.

For QoS to be effective, you must apply consistent QoS settings throughout your organization. Any part of the path that fails to support your QoS priorities can degrade the quality RDP session.

## Introduction to QoS queues

To provide QoS, network devices must have a way to classify traffic and must be able to distinguish RDP from other network traffic.

When network traffic enters a router, the traffic is placed into a queue. If a QoS policy isn't configured, there is only one queue, and all data is treated as first-in, first-out with the same priority. That means RDP traffic might get stuck behind traffic where a few extra milliseconds delay wouldn't be a problem.

When you implement QoS, you define multiple queues using one of several congestion management features, such as Cisco’s priority queuing and [Class-Based Weighted Fair Queueing (CBWFQ)](https://www.cisco.com/en/US/docs/ios/12_0t/12_0t5/feature/guide/cbwfq.html#wp17641) and congestion avoidance features, such as [weighted random early detection (WRED)](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/qos_conavd/configuration/15-mt/qos-conavd-15-mt-book/qos-conavd-cfg-wred.html).

A simple analogy is that QoS creates virtual "carpool lanes" in your data network. So some types of data never or rarely encounter a delay. Once you create those lanes, you can adjust their relative size and much more effectively manage the connection bandwidth you have while still delivering business-grade experiences for your organization's users.

## QoS implementation checklist

At a high level, do the following to implement QoS:

1. [Make sure your network is ready](#make-sure-your-network-is-ready)
2. [Make sure that RDP Shortpath for managed networks is enabled](./shortpath.md) - QoS policies are not supported for reverse connect transport
3. [Implement insertion of DSCP markers](#insert-dscp-markers) on session hosts

As you prepare to implement QoS, keep the following guidelines in mind:

* The shortest path to session host is best
* Any obstacles in between, such as proxies or packet inspection devices, aren't recommended

## Make sure your network is ready

If you're considering a QoS implementation, you should already have determined your bandwidth requirements and other [network requirements](/windows-server/remote/remote-desktop-services/network-guidance?context=/azure/virtual-desktop/context/context).
  
Traffic congestion across a network will significantly impact media quality. A lack of bandwidth leads to performance degradation and a poor user experience. As Azure Virtual Desktop adoption and usage grows, use [Log Analytics](./diagnostics-log-analytics.md) to identify problems and then make adjustments using QoS and selective bandwidth additions.

### VPN considerations

QoS only works as expected when implemented on all links between clients and session hosts. If you use QoS on an internal network and a user signs in from a remote location, you can only prioritize within your internal, managed network. Although remote locations can receive a managed connection by implementing a virtual private network (VPN), a VPN inherently adds packet overhead and creates delays in real-time traffic.

In a global organization with managed links that span continents, we strongly recommend QoS because bandwidth for those links is limited compared to the LAN.

## Insert DSCP markers

You could implement QoS using a Group Policy Object (GPO) to direct session hosts to insert a DSCP marker in IP packet headers identifying it as a particular type of traffic. Routers and other network devices can be configured to recognize these markings and put the traffic in a separate, higher-priority queue.

You can compare DSCP markings to postage stamps that indicate to postal workers how urgent the delivery is and how best to sort it for speedy delivery. Once you've configured your network to give priority to RDP streams, lost packets and late packets should diminish significantly.

Once all network devices are using the same classifications, markings, and priorities, it's possible to reduce or eliminate delays, dropped packets, and jitter. From the RDP perspective, the essential configuration step is the classification and marking of packets. However, for end-to-end QoS to be successful, you also need to align the RDP configuration with the underlying network configuration carefully.
The DSCP value tells a correspondingly configured network what priority to give a packet or stream.

We recommend using DSCP value 46 that maps to **Expedited Forwarding (EF)** DSCP class.

### Implement QoS on session host using Group Policy

You can use policy-based Quality of Service (QoS) within Group Policy to set the predefined DSCP value.

To create a QoS policy for domain-joined session hosts, first, sign in to a computer on which Group Policy Management has been installed. Open Group Policy Management (select Start, point to Administrative Tools, and then select Group Policy Management), and then complete the following steps:

1. In Group Policy Management, locate the container where the new policy should be created. For example, if all your session hosts computers are located in an OU named **"session hosts"**, the new policy should be created in the Session Hosts OU.

2. Right-click the appropriate container, and then select **Create a GPO in this domain, and Link it here**.

3. In the **New GPO** dialog box, type a name for the new Group Policy object in the **Name** box, and then select **OK**.

4. Right-click the newly created policy, and then select **Edit**.

5. In the Group Policy Management Editor, expand **Computer Configuration**, expand **Windows Settings**, right-click **Policy-based QoS**, and then select **Create new policy**.

6. In the **Policy-based QoS** dialog box, on the opening page, type a name for the new policy in the **Name** box. Select **Specify DSCP Value** and set the value to **46**. Leave **Specify Outbound Throttle Rate** unselected, and then select **Next**.

7. On the next page, select **Only applications with this executable name** and enter the name **svchost.exe**, and then select **Next**. This setting instructs the policy to only prioritize matching traffic from the Remote Desktop Service.

8. On the third page, make sure that both **Any source IP address** and **Any destination IP address** are selected, and then select **Next**. These two settings ensure that packets will be managed regardless of which computer (IP address) sent the packets and which computer (IP address) will receive the packets.

9. On page four, select **UDP** from the **Select the protocol this QoS policy applies to** drop-down list.

10. Under the heading **Specify the source port number**, select **From this source port or range**. In the accompanying text box, type **3390**. Select **Finish**.

The new policies you've created won't take effect until Group Policy has been refreshed on your session host computers. Although Group Policy periodically refreshes on its own, you can force an immediate refresh by following these steps:

1. On each session host for which you want to refresh Group Policy, open a Command Prompt as administrator (*Run as administrator*).

1. At the command prompt, enter

   ```console
   gpupdate /force
   ```

### Implement QoS on session host using PowerShell

You can set QoS for RDP Shortpath for managed networks using the PowerShell cmdlet below:

```powershell
New-NetQosPolicy -Name "RDP Shortpath for managed networks" -AppPathNameMatchCondition "svchost.exe" -IPProtocolMatchCondition UDP -IPSrcPortStartMatchCondition 3390 -IPSrcPortEndMatchCondition 3390 -DSCPAction 46 -NetworkProfile All
```

## Related articles

* [Quality of Service (QoS) Policy](/windows-server/networking/technologies/qos/qos-policy-top)

## Next steps

* To learn about bandwidth requirements for Azure Virtual Desktop, see [Understanding Remote Desktop Protocol (RDP) Bandwidth Requirements for Azure Virtual Desktop](rdp-bandwidth.md).
* To learn about Azure Virtual Desktop network connectivity, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md).
