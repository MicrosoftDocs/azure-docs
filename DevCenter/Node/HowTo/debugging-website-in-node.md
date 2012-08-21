# Debugging Windows Azure Web Sites in Node.js

iisnode is a native IIS module that allows hosting of node.js applications in IIS on Windows. When you hosted a Node.js web site on Windows Azure, it's running in issnode. This article describes several useful debugging features provided in iisnode. 

This task includes the following steps:

- Access server logs over HTTP and via FTP
- Review debugger errors in the browser
- Use node-inspector for debugging


iisnode.yml is an optional file that sits along side your web.config. It uses the [YAML](http://yaml.org/) file format, and allows you to set all available iisnode settings without having to ever touch web.config. Below is a simple example.

	# This is a simple iisnode.yml file 
	node_env: development 
	devErrorsEnabled: true 
	logggingEnabled: true

Set the **node_env** environment variable to development, which enables logging all node.exe output and enables developer errors.


![text](


1: ../