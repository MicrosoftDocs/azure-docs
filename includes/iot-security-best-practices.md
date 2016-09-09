# Internet of Things security best practices

Securing an Internet of Things (IoT) infrastructure requires a rigorous security-in-depth strategy. Starting from securing data in the cloud, to protecting data integrity while in transit over the public internet, and providing the ability to securely provision devices, each layer builds greater security assurance in the overall infrastructure. 

## Securing an IoT infrastructure
 
This security-in-depth strategy can be developed and executed with active participation of various players involved with the manufacturing, development, and deployment of IoT devices and infrastructure. Following is a high level description of these players.  

- **IoT hardware manufacturer/integrator**: typically these are the manufacturers of IoT hardware being deployed, hardware integrator assembling hardware from various manufacturers, or hardware supplier providing hardware for an IoT deployment manufactured or integrated by other suppliers.
- **IoT solution developer**: the development of an IoT solution is typically done by a solution developer, which may part of an in-house team, or a System Integrator (SI) specializing in this activity. The IoT solution developer can develop various components of the IoT solution from scratch, integrate various off the shelf or open source components, or adopt pre-configured solutions with minor adaptation.
- **IoT solution deployer**: once an IoT solution is developed, it needs to be deployed in the field. This involves deployment of hardware, interconnection of devices, and deployment of solutions in hardware devices, or in the cloud.
- **IoT solution operator**: once the IoT solution is deployed, it requires long term operations, monitoring, upgrades, and maintenance. This may be done by an in-house team comprising information technology specialists, hardware operations and maintenance teams, and domain specialists who monitor the correct behavior of overall IoT infrastructure. 

The sections that follows provide best practices for each of these players so as to develop, deploy and operate a secure IoT infrastructure. 

## IoT hardware manufacturer/integrator

Follow the best practices below if you are an IoT hardware manufacture or a hardware integrator:

- **Scope hardware to minimum requirements**: the hardware design should include minimum features required for operation of the hardware, and nothing more. An example is to include USB ports only if required for the operation of the device. These additional features open the device for unwanted attack vectors, which should be avoided. 
- **Make hardware tamper proof**: build in mechanism to detect physical tampering of hardware, such as opening of device cover, removing a part of the device, etc. These tamper signals may be part of the data stream uploaded to the cloud enabling alerting of these events to the operators. 
- **Build around secure hardware**: if COGS permit, build security features such as secure and encrypted storage and Trusted Platform Module (TPM) based boot functionality. These features make devices more secure protecting the overall IoT infrastructure.
- **Make upgrades secure**: upgrading firmware during lifetime of the device is inevitable. Building devices with secure paths for upgrades and cryptographic assurance of firmware version will allow the device to be secure during and after upgrades.

## IoT solution developer

Follow the best practices below if you are an IoT solution developer:

- **Follow secure software development methodology**: developing secure software requires a ground-up thinking about security from the inception of the project all the way to its implementation, testing, and deployment. The choice of platforms, languages, and tools are all influenced with this methodology. The Microsoft Security Development Lifecycle provides a step-by-step approach to building secure software.
- **Choose open source software with care**: open source software provides an opportunity to quickly develop solutions. When choosing open source software, consider the activity level of the community for each open source component. An active community ensures software will be supported; issues will be discovered and addressed. Alternatively, an obscure and inactive open source software will not be supported and issues will most probably not be discovered.
- **Integrate with care**: many of the software security flaws exist at the boundary of libraries and APIs. Functionality which may not be required for the current deployment may still be available via an API layer. Making sure that all interfaces of components being integrated are secure ensures overall security.      

## IoT solution deployer

Follow the best practices below if you are an IoT solution deployer:

- **Deploy hardware securely**: IoT deployments may require hardware to be deployed in unsecure locations, such as in public spaces or unsupervised locales. In such situations, ensure that hardware deployment is tamper proof to the maximum extent. If USB or other ports are available on the hardware, ensure that these are covered securely. Many attack vectors can use these as entry point for attacks.
- **Keep authentication keys safe**: during deployment, each device requires device IDs and associated authentication keys generated by the cloud service. Keep these keys physically safe even after the deployment. Any compromised key can be used by a malicious device to masquerade as an existing device.

## IoT solution operator

Follow the best practices below if you are an IoT solution operator:

- **Keep system up to date**: ensure device operating systems and all device drivers are updated to the latest versions. Windows 10 (IoT or other SKUs), with automatic updates turned on, is kept up to date by Microsoft, providing a secure operating system for IoT devices. For other operating systems, such as Linux, keeping them up to date ensures they are also protected against malicious attacks. 
- **Protect against malicious activity**: if the operating system permits, place the latest anti-virus and anti-malware capabilities on each device operating system. This can help mitigate most external threats. Most modern operating systems, such as Windows 10 IoT and Linux, can be protected against this threat by taking appropriate steps. 
- **Audit frequently**: auditing IoT infrastructure for security related issues is key when responding to security incidents. Most operating systems, such as Windows 10 (IoT and other SKUs), provide built-in event logging that should be reviewed frequently to make sure no security breach has occurred. Audit information can be sent as a separate telemetry stream to the cloud service and analyzed.
- **Physically protect the IoT infrastructure**: the worst security attacks against IoT infrastructure are launched using physical access to devices. Protecting against malicious use of USB ports and other physical access is an important safety and security practice. Logging of physical access, such as USB port usage, is key to uncovering any breach that may have occurred. Again, Windows 10 (IoT and other SKUs) enables detailed logging of these events.
- **Protect cloud credentials**: cloud authentication credentials used for configuring and operating an IoT deployment are possibly the easiest way to gain access and compromise an IoT system. Protect the credentials by changing the password frequently, and not using these credentials on public machines. 

Capabilities of different IoT devices vary. On one hand, some devices may be full blown computers running common desktop operating systems, while on the other hand, some devices may be running very light-weight operating systems. Security best practices described above may be applicable to these devices in varying degree. If provided, additional security and deployment best practices provided by manufacturer of these devices should be followed. 

Some legacy and constrained devices may not have been designed specifically for IoT deployment. These devices may lack the capability to encrypt data, connect with the Internet, provide advanced auditing, etc. In these cases, using a modern and secure field gateway to aggregate data from legacy devices may provide the security required for connecting these devices over the Internet. Field gateways in this case provides secure authentication, negotiation of encrypted sessions, receipt of commands from the cloud, and many other security features. 