<properties
   pageTitle="Sample Application for Use with Security Boundary Environments | Microsoft Azure"
   description="Deploy this simple web application after creating a DMZ to test traffic flow scenarios"
   services="virtual-network"
   documentationCenter="na"
   authors="tracsman"
   manager="rossort"
   editor=""/>

<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/16/2015"
   ms.author="jonor"/>

# Sample Application for Use with Security Boundary Environments

[Return to the Security Boundary Best Practices Page][HOME]

These PowerShell scripts can be run locally on the IIS01 and AppVM01 servers to install and setup a very simple web application that displays an html page from the front end IIS01 server with content from the backend AppVM01 server.

This will app provides a simple testing environment for many of the DMZ Examples and how changes on the Endpoints, NSGs, UDR, and Firewall rules can effect traffic flows.

## Firewall Rule to Allow ICMP
This simple PowerShell statement can be run on any Windows VM to allow ICMP (Ping) traffic. This will allow for easier testing and troubleshooting by allowing the ping protocol to pass through the windows firewall (for most Linux distros ICMP is on by default).

	# Turn On ICMPv4
	New-NetFirewallRule -Name Allow_ICMPv4 -DisplayName "Allow ICMPv4" `
		-Protocol ICMPv4 -Enabled True -Profile Any -Action Allow

**Note:** If you use the below scripts, this firewall rule addition is the first statement.

## IIS01 - Web Application Installation Script
This script will;

1.	Open IMCPv4 (Ping) on the local server windows firewall for easier testing
2.	Install IIS
3.	Create an ASP.NET web page and a Web.config file
4.	Change the Default application pool to make file access easier

This PowerShell script should be run locally while RDP’d into IIS01.

	# IIS Server Post Build Config Script
	
	# Turn On ICMPv4
	New-NetFirewallRule -Name Allow_ICMPv4 -DisplayName "Allow ICMPv4" -Protocol ICMPv4 -Enabled True -Profile Any -Action Allow
	
	# Install IIS
	add-windowsfeature Web-Server, Web-WebServer, Web-Common-Http, Web-Default-Doc, Web-Dir-Browsing, Web-Http-Errors, Web-Static-Content, Web-Health, Web-Http-Logging, Web-Performance, Web-Stat-Compression, Web-Security, Web-Filtering, Web-App-Dev, Web-ISAPI-Ext, Web-ISAPI-Filter, Web-Net-Ext, Web-Net-Ext45, Web-Asp-Net45, Web-Mgmt-Tools, Web-Mgmt-Console
	
	# Create Web App Pages
	$MainPage = '<%@ Page Language="vb" AutoEventWireup="false" %>
	<%@ Import Namespace="System.IO" %>
	<script language="vb" runat="server">
	    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
	        Dim FILENAME As String = "\\10.0.2.5\WebShare\Rand.txt")
	        Dim objStreamReader As StreamReader
	        objStreamReader = File.OpenText(FILENAME)
	        Dim contents As String = objStreamReader.ReadToEnd()
	        lblOutput.Text = contents
	        objStreamReader.Close()
	    End Sub
	</script>
	
	<!DOCTYPE html>
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
	    <title>Working Title v2</title>
	</head>
	<body>
	    <form id="form1" runat="server">
	        <div>
	            <h1>Looks like we made it! (v2)</h1>
	            This is a page from the inside, and it is making its way to the outside!<br />
	            <br />
	            <img src="http://sd.keepcalm-o-matic.co.uk/i/keep-calm-you-made-it-7.png" alt="I made it!" /><br />
	            <b>File Output from AppVM01</b><br />
	            <asp:Label runat="server" ID="lblOutput" />
	        </div>
	    </form>
	</body>
	</html>'
	
	$WebConfig ='<?xml version="1.0" encoding="utf-8"?>
	<configuration>
	  <system.web>
	    <compilation debug="true" strict="false" explicit="true" targetFramework="4.5" />
	    <httpRuntime targetFramework="4.5" />
	  </system.web>
	  <system.webServer>
	    <defaultDocument>
	      <files>
	        <add value="Home.aspx" />
	      </files>
	    </defaultDocument>
	  </system.webServer>
	</configuration>'
	
	$MainPage | Out-File -FilePath "C:\inetpub\wwwroot\Home.aspx" -Encoding ascii
	$WebConfig | Out-File -FilePath "C:\inetpub\wwwroot\Web.config" -Encoding ascii
	
	# Set App Pool to Clasic Pipeline to remote file access will work easier
	Set-ItemProperty 'IIS:\Sites\Default Web Site' ApplicationPool ".NET v4.5 Classic"
	
	# Make sure the IIS settings take
	Restart-Service -Name W3SVC

## AppVM01 - File Server Installation Script
This script sets up the back end for this simple application. This script will;

1.	Open IMCPv4 (Ping) on the firewall for easier testing
2.	Create a new directory
3.	Create a text file to be remotely access by the web page above
4.	Set permissions on the directory and file to allow access
5.	Turn off IE Enhanced Security to allow easier browsing from this server 

>[AZURE.IMPORTANT] **Best Practice**: Never turn off IE Enhanced Security on a production server, it's generally a bad idea to surf the web from a production server.)

This PowerShell script should be run locally while RDP’d into AppVM01. PowerShell is required to be run as Administrator to ensure successful execution.
	
	# AppVM01 Server Post Build Config Script
	# Must be run as Administrator for Net Share and Create("User") commands to work
	
	# Turn On ICMPv4
	    New-NetFirewallRule -Name Allow_ICMPv4 -DisplayName "Allow ICMPv4" -Protocol ICMPv4 -Enabled True -Profile Any -Action Allow
	
	# Create Directory
	    New-Item "C:\WebShare" -ItemType Directory
	
	# Write out Rand.txt
	    $FileContent = "Hello, I'm the contents of a remote file on AppVM01."
	    $FileContent | Out-File -FilePath "C:\WebShare\Rand.txt" -Encoding ascii
	
	# Set Permissions on share
	    $Acl = Get-Acl "C:\WebShare"
	    $AccessRule = New-Object system.security.accesscontrol.filesystemaccessrule("Everyone","ReadAndExecute, Synchronize","ContainerInherit, ObjectInherit","InheritOnly","Allow")
	    $Acl.SetAccessRule($AccessRule)
	    Set-Acl "C:\WebShare" $Acl
	
	# Create network share
	    Net Share WebShare=C:\WebShare "/grant:Everyone,READ"
	
	# Turn Off IE Enhanced Security Configuration for Admins
	    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}" -Name "IsInstalled" -Value 0
	
	# Create new local Admin user for script purposes
	    $Computer = [ADSI]"WinNT://$Env:COMPUTERNAME,Computer"
	    $LocalAdmin = $Computer.Create("User", "LocalAdmin")
	    $LocalAdmin.SetPassword("Password01")
	    $LocalAdmin.SetInfo()
	    $LocalAdmin.FullName = "Local Admin by Powershell"
	    $LocalAdmin.SetInfo()
	    $LocalAdmin.UserFlags = 64 + 65536 # PASSWD_CANT_CHANGE + DONT_EXPIRE_PASSWD
	    $LocalAdmin.SetInfo()

## DNS01 - DNS Server Installation Script
There is no script included in this sample application to setup the DNS server. If testing of the firewall rules, NSG, or UDR needs to include DNS traffic, the DNS01 server will need to be setup manually. The Network Configuration xml file for both examples includes DNS01 as the primary DNS server and the public DNS server hosted by Level 3 as the backup DNS server. The Level 3 DNS server would be the actual DNS server used for non-local traffic, and with DNS01 not setup, no local DNS would occur.

<!--Link References-->
[HOME]: ../best-practices-network-security.md