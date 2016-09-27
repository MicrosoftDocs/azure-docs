<properties 
	pageTitle="Media Services PlayReady License Template Overview" 
	description="This topic gives an overview of a PlayReady license template that used to configure PlayReady licenses." 
	authors="juliako" 
	manager="erikre" 
	editor="" 
	services="media-services" 
	documentationCenter=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
 	ms.date="06/22/2016"  
	ms.author="juliako"/>

#Media Services PlayReady License Template Overview

Azure Media Services now provides a service for delivering Microsoft PlayReady licenses. When the end user player (for example, Silverlight) tries to play your PlayReady protected content, a request is sent to the license delivery service to obtain a license. If the license service approves the request, it issues the license which is sent to the client and can be used to decrypt and play the specified content.

Media Services also provides APIs that let you configure your PlayReady licenses. Licenses contain the rights and restrictions that you want for the PlayReady DRM runtime to enforce when a user is trying to playback protected content.
Below are some examples of PlayReady license restrictions that you can specify:

- The DateTime from which the license is valid.
- The DateTime value when the license expires. 
- For the license to be saved in persistent storage on the client. Persistent licenses are typically used to allow offline playback of the content.
- The minimum security level that a player must have to play your content. 
- The output protection level for the output controls for audio\video content. 
- For more information, see the Output Controls section (3.5) in the [PlayReady Compliance Rules](https://www.microsoft.com/playready/licensing/compliance/) document.

>[AZURE.NOTE]Currently, you can only configure the PlayRight of the PlayReady license (this right is required). The PlayRight gives the client the ability to playback the content. The PlayRight also allows configuring restrictions specific to playback. For more information, see [PlayReadyPlayRight](media-services-playready-license-template-overview.md#PlayReadyPlayRight).

To configure PlayReady licenses using Media Services, you must configure the Media Services PlayReady license template. The template is defined in XML.

The following example shows the simplest (and most common) template that configures a basic streaming license. With this license, your clients would be able to playback your PlayReady protected content.
	
	<?xml version="1.0" encoding="utf-8"?>
	<PlayReadyLicenseResponseTemplate xmlns:i="http://www.w3.org/2001/XMLSchema-instance" 
	                                  xmlns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyTemplate/v1">
	  <LicenseTemplates>
	    <PlayReadyLicenseTemplate>
	      <ContentKey i:type="ContentEncryptionKeyFromHeader" />
	      <PlayRight />
	    </PlayReadyLicenseTemplate>
	  </LicenseTemplates>
	</PlayReadyLicenseResponseTemplate>

The XML conforms to the PlayReady license template XML schema defined in the PlayReady license template XML schema section.

Media Services also defines a set of .NET classes that could be used to serialized and deserialized to and from the XML. For description of main classes, see [Media Services .NET classes](media-services-playready-license-template-overview.md#classes). that are used to configure license templates.

For an end-to-end example that uses .NET classes to configure the PlayReady license template, see [Using PlayReady Dynamic Encryption and License Delivery Service](https://msdn.microsoft.com/library/azure/dn783467.aspx).

##<a id="classes"></a>Media Services .NET classes that are used to configure license templates

The following are the main .NET classes are used to configure Media Services PlayReady license templates. These classes map to the types defined in [PlayReady license template XML schema](media-services-playready-license-template-overview.md#schema).

The [MediaServicesLicenseTemplateSerializer](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mediaservices.client.contentkeyauthorization.mediaserviceslicensetemplateserializer.aspx) class is used to serialize and deserialize to and from the Media Services license template XML.

###PlayReadyLicenseResponseTemplate

[PlayReadyLicenseResponseTemplate](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mediaservices.client.contentkeyauthorization.playreadylicenseresponsetemplate.aspx) - This class represents the template for the response sent back to the end user. It contains a field for a custom data string between the license server and the application (may be useful for custom app logic) as well as a list of one or more license templates.

This is the “top level” class in the template hierarchy. Meaning that the response template includes a list of license templates and the license templates include (directly or indirectly) all of the other classes that make up the template data to be serialized.


###PlayReadyLicenseTemplate

[PlayReadyLicenseTemplate](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mediaservices.client.contentkeyauthorization.playreadylicensetemplate.aspx) - The class represents a license template for creating PlayReady licenses to be returned to the end users. It contains the data on the content key in the license and any rights or restrictions to be enforced by the PlayReady DRM runtime when using the content key.


###<a id="PlayReadyPlayRight"></a>PlayReadyPlayRight

[PlayReadyPlayRight](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mediaservices.client.contentkeyauthorization.playreadyplayright.aspx) - This class represents the PlayRight of a PlayReady license. It grants the user the ability to playback the content subject to the zero or more restrictions configured in the license and on the PlayRight itself (for playback specific policy). Much of the policy on the PlayRight has to do with output restrictions which control the types of outputs that the content can be played over and any restrictions that must be put in place when using a given output. For example, if the DigitalVideoOnlyContentRestriction is enabled, then the DRM runtime will only allow the video to be displayed over digital outputs (analog video outputs won’t be allowed to pass the content).

>[AZURE.IMPORTANT]These types of restrictions can be very powerful but can also affect the consumer experience. If the output protections are configured too restrictive, the content might be unplayable on some clients. For more information, see the [PlayReady Compliance Rules](https://www.microsoft.com/playready/licensing/compliance/) document.

For an example of what protection levels Silverlight supports, see: [Silverlight support for output protections](http://go.microsoft.com/fwlink/?LinkId=617318).

##<a id="schema"></a>PlayReady license template XML schema
	
	<?xml version="1.0" encoding="utf-8"?>
	<xs:schema xmlns:tns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyTemplate/v1" xmlns:ser="http://schemas.microsoft.com/2003/10/Serialization/" elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyTemplate/v1" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	  <xs:import namespace="http://schemas.microsoft.com/2003/10/Serialization/" />
	  <xs:complexType name="AgcAndColorStripeRestriction">
	    <xs:sequence>
	      <xs:element minOccurs="0" name="ConfigurationData" type="xs:unsignedByte" />
	    </xs:sequence>
	  </xs:complexType>
	  <xs:element name="AgcAndColorStripeRestriction" nillable="true" type="tns:AgcAndColorStripeRestriction" />
	  <xs:simpleType name="ContentType">
	    <xs:restriction base="xs:string">
	      <xs:enumeration value="Unspecified" />
	      <xs:enumeration value="UltravioletDownload" />
	      <xs:enumeration value="UltravioletStreaming" />
	    </xs:restriction>
	  </xs:simpleType>
	  <xs:element name="ContentType" nillable="true" type="tns:ContentType" />
	  <xs:complexType name="ExplicitAnalogTelevisionRestriction">
	    <xs:sequence>
	      <xs:element minOccurs="0" name="BestEffort" type="xs:boolean" />
	      <xs:element minOccurs="0" name="ConfigurationData" type="xs:unsignedByte" />
	    </xs:sequence>
	  </xs:complexType>
	  <xs:element name="ExplicitAnalogTelevisionRestriction" nillable="true" type="tns:ExplicitAnalogTelevisionRestriction" />
	  <xs:complexType name="PlayReadyContentKey">
	    <xs:sequence />
	  </xs:complexType>
	  <xs:element name="PlayReadyContentKey" nillable="true" type="tns:PlayReadyContentKey" />
	  <xs:complexType name="ContentEncryptionKeyFromHeader">
	    <xs:complexContent mixed="false">
	      <xs:extension base="tns:PlayReadyContentKey">
	        <xs:sequence />
	      </xs:extension>
	    </xs:complexContent>
	  </xs:complexType>
	  <xs:element name="ContentEncryptionKeyFromHeader" nillable="true" type="tns:ContentEncryptionKeyFromHeader" />
	  <xs:complexType name="ContentEncryptionKeyFromKeyIdentifier">
	    <xs:complexContent mixed="false">
	      <xs:extension base="tns:PlayReadyContentKey">
	        <xs:sequence>
	          <xs:element minOccurs="0" name="KeyIdentifier" type="ser:guid" />
	        </xs:sequence>
	      </xs:extension>
	    </xs:complexContent>
	  </xs:complexType>
	  <xs:element name="ContentEncryptionKeyFromKeyIdentifier" nillable="true" type="tns:ContentEncryptionKeyFromKeyIdentifier" />
	  <xs:complexType name="PlayReadyLicenseResponseTemplate">
	    <xs:sequence>
	      <xs:element name="LicenseTemplates" nillable="true" type="tns:ArrayOfPlayReadyLicenseTemplate" />
	      <xs:element minOccurs="0" name="ResponseCustomData" nillable="true" type="xs:string">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	    </xs:sequence>
	  </xs:complexType>
	  <xs:element name="PlayReadyLicenseResponseTemplate" nillable="true" type="tns:PlayReadyLicenseResponseTemplate" />
	  <xs:complexType name="ArrayOfPlayReadyLicenseTemplate">
	    <xs:sequence>
	      <xs:element minOccurs="0" maxOccurs="unbounded" name="PlayReadyLicenseTemplate" nillable="true" type="tns:PlayReadyLicenseTemplate" />
	    </xs:sequence>
	  </xs:complexType>
	  <xs:element name="ArrayOfPlayReadyLicenseTemplate" nillable="true" type="tns:ArrayOfPlayReadyLicenseTemplate" />
	  <xs:complexType name="PlayReadyLicenseTemplate">
	    <xs:sequence>
	      <xs:element minOccurs="0" name="AllowTestDevices" type="xs:boolean" />
	      <xs:element minOccurs="0" name="BeginDate" nillable="true" type="xs:dateTime">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element name="ContentKey" nillable="true" type="tns:PlayReadyContentKey" />
	      <xs:element minOccurs="0" name="ContentType" type="tns:ContentType">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="ExpirationDate" nillable="true" type="xs:dateTime">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="GracePeriod" nillable="true" type="ser:duration">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="LicenseType" type="tns:PlayReadyLicenseType" />
	      <xs:element minOccurs="0" name="PlayRight" nillable="true" type="tns:PlayReadyPlayRight" />
	    </xs:sequence>
	  </xs:complexType>
	  <xs:element name="PlayReadyLicenseTemplate" nillable="true" type="tns:PlayReadyLicenseTemplate" />
	  <xs:simpleType name="PlayReadyLicenseType">
	    <xs:restriction base="xs:string">
	      <xs:enumeration value="Nonpersistent" />
	      <xs:enumeration value="Persistent" />
	    </xs:restriction>
	  </xs:simpleType>
	  <xs:element name="PlayReadyLicenseType" nillable="true" type="tns:PlayReadyLicenseType" />
	  <xs:complexType name="PlayReadyPlayRight">
	    <xs:sequence>
	      <xs:element minOccurs="0" name="AgcAndColorStripeRestriction" nillable="true" type="tns:AgcAndColorStripeRestriction">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="AllowPassingVideoContentToUnknownOutput" type="tns:UnknownOutputPassingOption">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="AnalogVideoOpl" nillable="true" type="xs:int">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="CompressedDigitalAudioOpl" nillable="true" type="xs:int">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="CompressedDigitalVideoOpl" nillable="true" type="xs:int">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="DigitalVideoOnlyContentRestriction" type="xs:boolean">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="ExplicitAnalogTelevisionOutputRestriction" nillable="true" type="tns:ExplicitAnalogTelevisionRestriction">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="FirstPlayExpiration" nillable="true" type="ser:duration">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="ImageConstraintForAnalogComponentVideoRestriction" type="xs:boolean">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="ImageConstraintForAnalogComputerMonitorRestriction" type="xs:boolean">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="ScmsRestriction" nillable="true" type="tns:ScmsRestriction">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="UncompressedDigitalAudioOpl" nillable="true" type="xs:int">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	      <xs:element minOccurs="0" name="UncompressedDigitalVideoOpl" nillable="true" type="xs:int">
	        <xs:annotation>
	          <xs:appinfo>
	            <DefaultValue EmitDefaultValue="false" xmlns="http://schemas.microsoft.com/2003/10/Serialization/" />
	          </xs:appinfo>
	        </xs:annotation>
	      </xs:element>
	    </xs:sequence>
	  </xs:complexType>
	  <xs:element name="PlayReadyPlayRight" nillable="true" type="tns:PlayReadyPlayRight" />
	  <xs:simpleType name="UnknownOutputPassingOption">
	    <xs:restriction base="xs:string">
	      <xs:enumeration value="NotAllowed" />
	      <xs:enumeration value="Allowed" />
	      <xs:enumeration value="AllowedWithVideoConstriction" />
	    </xs:restriction>
	  </xs:simpleType>
	  <xs:element name="UnknownOutputPassingOption" nillable="true" type="tns:UnknownOutputPassingOption" />
	  <xs:complexType name="ScmsRestriction">
	    <xs:sequence>
	      <xs:element minOccurs="0" name="ConfigurationData" type="xs:unsignedByte" />
	    </xs:sequence>
	  </xs:complexType>
	  <xs:element name="ScmsRestriction" nillable="true" type="tns:ScmsRestriction" />
	</xs:schema>



##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
