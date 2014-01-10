<h2><span  class="short-header">Azure SSL Certs on Ubuntu 12.04</span></h2>

An easy way for handling client authentication certificates on Ubuntu is to use <b>stunnel</b> to reverse proxy to your web server of choice(Nginx, Passenger, etc).

<h3>Reverse Proxy with <b>stunnel</b></h3>

You can configure <b>stunnel</b> to listen to port 443 and then pass the requests on to port 80 (or whatever your web server is using).

Once configured to port forward, you can then configure <b>stunnel</b> to validate the client certificates that are coming in on port 443.

Let's start by install <b>stunnel</b>

    sudo apt-get install stunnel4

This will install <b>stunnel</b> to automatically run as a service. We just need to enable it. We can do this by opening

    sudo nano /etc/default/stunnel4 

And changing the line that says ENABLED=0 to 1

    (change) ENABLED=0 to ENABLED=1

Close and save the file.

Now we need to create a config file. We must create this file in the /etc/stunnel/ directory.

    sudo nano /etc/stunnel/stunnel.conf

Copy and paste the following lines into this file. <i>There are many options for configuration which you can find [here][0], but this is the minimum to get it working.</i> 

    ; Location for stunnel to put its pid
    pid = /home/stunnel.pid

    ; Your SSL key (from your CA)
    key = /home/ubuntu/server.key

    ; Your Certificate (from your CA)
    cert = /home/ubuntu/server.crt 	

    ; Optional, nice for debugging
    debug = 7 						   
    output = /var/log/stunnel4/stunnel.log

    ; Allow connection retries
    retry = yes
    
    ; Level of Authentication
    verify = 2

    ; Location of accepted certs
    CApath = /etc/stunnel/certs

    ; Listen for forward ports
    [https]
    accept  = 443
    connect = 80

    ; Set value for close timeout
    TIMEOUTclose = 0


Save and close this file. We are assuming

Now we need to create and add some files to the <b>/etc/stunnel/certs</b> directory. These files have cryptic filenames because they represent hashes that OpenSSL uses to  identify certificates.

    sudo mkdir /etc/stunnel/certs
    cd /etc/stunnel/certs
   
    sudo wget https://s3-us-west-1.amazonaws.com/bblobs/public_certs/3f2a05af.0
    sudo wget https://s3-us-west-1.amazonaws.com/bblobs/public_certs/4f9ecf48.0
    sudo wget https://s3-us-west-1.amazonaws.com/bblobs/public_certs/75ced341.0
    sudo wget https://s3-us-west-1.amazonaws.com/bblobs/public_certs/874806e2.0
    sudo wget https://s3-us-west-1.amazonaws.com/bblobs/public_certs/c391a044.0
    sudo wget https://s3-us-west-1.amazonaws.com/bblobs/public_certs/c692a373.0
    sudo wget https://s3-us-west-1.amazonaws.com/bblobs/public_certs/db3e2959.0

    sudo chmod 600 *

There are all just .crt versions of MS Root Certificate Authorities and the Basic root certificates from trusted CAs.

Lastly, you need to restart <b>stunnel</b> with the new configuration…

    sudo /etc/init.d/stunnel4 restart

Now, all incoming https requests should be being routed to port 80, which automatic client certificate authentication happening.

Good luck!





<!---->
[0] :https://www.stunnel.org/static/stunnel.html


