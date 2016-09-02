<properties
   pageTitle="ExpressRoute customer router configuration samples | Microsoft Azure"
   description="This page provides router config samples for Cisco and Juniper routers."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carmonm"
   editor="" />
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/19/2016"
   ms.author="cherylmc"/>

# Router configuration samples to setup and manage routing

This page provides interface and routing configuration samples for Cisco IOS-XE and Juniper MX series routers. These are intended to be samples for guidance only and must not be used as is. You can work with your vendor to come up with appropriate configurations for your network. 

>[AZURE.IMPORTANT] Samples in this page are intended to be purely for guidance. You must work with your vendor's sales / technical team and your networking team to come up with appropriate configurations to meet your needs. Microsoft will not support issues related to configurations listed in this page. You must contact your device vendor for support issues.

Router configuration samples below apply to all peerings. Review [ExpressRoute peerings](expressroute-circuit-peerings.md) and [ExpressRoute routing requirements](expressroute-routing.md) for more details on routing.

## Cisco IOS-XE based routers

The samples in this section apply for any router running the IOS-XE OS family.

### 1. Configuring interfaces and sub-interfaces

You will require a sub interface per peering in every router you connect to Microsoft. A sub interface can be identified with a VLAN ID or a stacked pair of VLAN IDs and an IP address.

#### Dot1Q interface definition

This sample provides the sub-interface definition for a sub-interface with a single VLAN ID. The VLAN ID is unique per peering. The last octet of your IPv4 address will always be an odd number.

    interface GigabitEthernet<Interface_Number>.<Number>
     encapsulation dot1Q <VLAN_ID>
     ip address <IPv4_Address><Subnet_Mask>

#### QinQ interface definition

This sample provides the sub-interface definition for a sub-interface with a two VLAN IDs. The outer VLAN ID (s-tag), if used remains the same across all the peerings. The inner VLAN ID (c-tag) is unique per peering. The last octet of your IPv4 address will always be an odd number.

    interface GigabitEthernet<Interface_Number>.<Number>
     encapsulation dot1Q <s-tag> seconddot1Q <c-tag>
     ip address <IPv4_Address><Subnet_Mask>
    
### 2. Setting up eBGP sessions

You must setup a BGP session with Microsoft for every peering. The sample below enables you to setup a BGP session with Microsoft. If the IPv4 address you used for your sub interface was a.b.c.d, the IP address of the BGP neighbor (Microsoft) will be a.b.c.d+1. The last octet of the BGP neighbor's IPv4 address will always be an even number.

	router bgp <Customer_ASN>
	 bgp log-neighbor-changes
	 neighbor <IP#2_used_by_Azure> remote-as 12076
	 !        
	 address-family ipv4
	 neighbor <IP#2_used_by_Azure> activate
	 exit-address-family
	!

### 3. Setting up prefixes to be advertised over the BGP session

You can configure your router to advertise select prefixes to Microsoft. You can do so using the sample below.

	router bgp <Customer_ASN>
	 bgp log-neighbor-changes
	 neighbor <IP#2_used_by_Azure> remote-as 12076
	 !        
	 address-family ipv4
	  network <Prefix_to_be_advertised> mask <Subnet_mask>
	  neighbor <IP#2_used_by_Azure> activate
	 exit-address-family
	!

### 4. Route maps

You can use route-maps and prefix lists to filter prefixes propagated into your network. You can use the sample below to accomplish the task. Ensure that you have appropriate prefix lists setup.

	router bgp <Customer_ASN>
	 bgp log-neighbor-changes
	 neighbor <IP#2_used_by_Azure> remote-as 12076
	 !        
	 address-family ipv4
	  network <Prefix_to_be_advertised> mask <Subnet_mask>
	  neighbor <IP#2_used_by_Azure> activate
	  neighbor <IP#2_used_by_Azure> route-map <MS_Prefixes_Inbound> in
	 exit-address-family
	!
	route-map <MS_Prefixes_Inbound> permit 10
	 match ip address prefix-list <MS_Prefixes>
	!


## Juniper MX series routers 

The samples in this section apply for any Juniper MX series routers.

### 1. Configuring interfaces and sub-interfaces

#### Dot1Q interface definition

This sample provides the sub-interface definition for a sub-interface with a single VLAN ID. The VLAN ID is unique per peering. The last octet of your IPv4 address will always be an odd number.

    interfaces {
    	vlan-tagging;
    	<Interface_Number> {
    		unit <Number> {
    			vlan-id <VLAN_ID>;
    			family inet {
    				address <IPv4_Address/Subnet_Mask>;
    			}
    		}
    	}
    }


#### QinQ interface definition

This sample provides the sub-interface definition for a sub-interface with a two VLAN IDs. The outer VLAN ID (s-tag), if used remains the same across all the peerings. The inner VLAN ID (c-tag) is unique per peering. The last octet of your IPv4 address will always be an odd number.

	interfaces {
	    <Interface_Number> {
	        flexible-vlan-tagging;
	        unit <Number> {
	            vlan-tags outer <S-tag> inner <C-tag>;
	            family inet {
	                address <IPv4_Address/Subnet_Mask>;
	            }                           
	        }                               
	    }                                   
	}                           

### 2. Setting up eBGP sessions

You must setup a BGP session with Microsoft for every peering. The sample below enables you to setup a BGP session with Microsoft. If the IPv4 address you used for your sub interface was a.b.c.d, the IP address of the BGP neighbor (Microsoft) will be a.b.c.d+1. The last octet of the BGP neighbor's IPv4 address will always be an even number.

	routing-options {
	    autonomous-system <Customer_ASN>;
	}
	}
	protocols {
	    bgp { 
	        group <Group_Name> { 
	            peer-as 12076;              
	            neighbor <IP#2_used_by_Azure>;
	        }                               
	    }                                   
	}

### 3. Setting up prefixes to be advertised over the BGP session

You can configure your router to advertise select prefixes to Microsoft. You can do so using the sample below.

	policy-options {
	    policy-statement <Policy_Name> {
	        term 1 {
	            from protocol OSPF;
		route-filter <Prefix_to_be_advertised/Subnet_Mask> exact;
	            then {
	                accept;
	            }
	        }
	    }
	}
	protocols {
	    bgp { 
	        group <Group_Name> { 
	            export <Policy_Name>
	            peer-as 12076;              
	            neighbor <IP#2_used_by_Azure>;
	        }                               
	    }                                   
	}


### 4. Route maps

You can use route-maps and prefix lists to filter prefixes propagated into your network. You can use the sample below to accomplish the task. Ensure that you have appropriate prefix lists setup.

	policy-options {
	    prefix-list MS_Prefixes {
	        <IP_Prefix_1/Subnet_Mask>;
	        <IP_Prefix_2/Subnet_Mask>;
	    }
	    policy-statement <MS_Prefixes_Inbound> {
	        term 1 {
	            from {
		prefix-list MS_Prefixes;
	            }
	            then {
	                accept;
	            }
	        }
	    }
	}
	protocols {
	    bgp { 
	        group <Group_Name> { 
	            export <Policy_Name>
	            import <MS_Prefixes_Inbound>
	            peer-as 12076;              
	            neighbor <IP#2_used_by_Azure>;
	        }                               
	    }                                   
	}

## Next Steps

See the [ExpressRoute FAQ](expressroute-faqs.md) for more details.
