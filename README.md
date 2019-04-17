# dl2v2update

### A minimalistic RESOL device firmware update server.


## Overview

The following LAN-enabled devices produced by [RESOL](http://www.resol.de/) support firmware updates over the air:

- RESOL Datalogger DL2
- RESOL Datalogger DL3
- RESOL KM1

Although RESOL continues to publish firmware updates on their homepage, the automatic firmware update service has been
shutdown due to legal reasons.

Performing a firmware update now requires you to download the appropriate image files, put the files onto a SD card and
insert that into the device. And in the case of the KM1 (which has no SD card slot) this method isn't even an option.

This project originally started as a way to update a RESOL DL2 version 1.x to version 2.x, but has been extended
slightly to support updating all three products to current firmware versions.



## DISCLAIMER

This software is provided as-is. Use it at your own risk!

Performing a firmware update over the air always has the risk of failing and leaving the device in an inoperable state.
If that happens the device must be sent back to RESOL for a firmware restore.

You have been warned!



## Prerequisites

- Node.js (tested with version 4.4.5) and its npm package manager
- git



## Initial Setup

To get a local copy of the repository and install all required Node.js modules you need to run these commands from
your console:

	git clone https://github.com/danielwippermann/dl2v2update
	cd dl2v2update
	npm install

After that you need to download and unpack one or more of the firmware image bundles provided on RESOL's homepage:

	# for DL2
	wget https://cdn.resol.de/firmware/RESOL_DL2-2.1.5-201602081156-Firmware.zip
	mkdir public/RESOL_DL2-2.1.5-201602081156-Firmware
	cd public/RESOL_DL2-2.1.5-201602081156-Firmware
	unzip ../../RESOL_DL2-2.1.5-201602081156-Firmware.zip
	cd ../..

	# for DL3
	wget https://cdn.resol.de/firmware/RESOL_DL3-2.1.5-201602080850-Firmware.zip
	mkdir public/RESOL_DL3-2.1.5-201602080850-Firmware
	cd public/RESOL_DL3-2.1.5-201602080850-Firmware
	unzip ../../RESOL_DL3-2.1.5-201602080850-Firmware.zip
	cd ../..

	# for KM1
	wget https://cdn.resol.de/firmware/RESOL_KM1-2.1.5-201602081152-Firmware.zip
	mkdir public/RESOL_KM1-2.1.5-201602081152-Firmware
	cd public/RESOL_KM1-2.1.5-201602081152-Firmware
	unzip ../../RESOL_KM1-2.1.5-201602081152-Firmware.zip
	cd ../..

If you download and unpack all bundles, your `public` directory should look something like this:

	public
	├── RESOL_DL2-2.1.5-201602081156-Firmware
	│   ├── RESOL
	│   │   └── DL2
	│   │       ├── firmware.bin
	│   │       ├── firmware.json
	│   │       └── firmware.yml
	│   ├── RESOL_DL2-2.1.5-201602081156-SDK.zip
	│   └── licenses-RESOL.txt
	├── RESOL_DL3-2.1.5-201602080850-Firmware
	│   ├── RESOL
	│   │   └── DL3
	│   │       ├── firmware.bin
	│   │       ├── firmware.json
	│   │       └── firmware.yml
	│   ├── RESOL_DL3-2.1.5-201602080850-SDK.zip
	│   └── licenses-RESOL.txt
	├── RESOL_KM1-2.1.5-201602081152-Firmware
	│   ├── RESOL
	│   │   └── KM1
	│   │       ├── firmware.bin
	│   │       ├── firmware.json
	│   │       └── firmware.yml
	│   ├── RESOL_KM1-2.1.5-201602081152-SDK.zip
	│   └── licenses-RESOL.txt
	└── index.html


## Running the service

After you completed the initial setup you can then start the service:

	$ node index.js
	Server started, happy updating...

	URLs:
	    - http://192.168.2.100:3000/api/update/<token>

	Valid values for <token>:
	    DL2v1  =>  RESOL DL2 Version 2.1.5 (201602081156)
	    DL2v2  =>  RESOL DL2 Version 2.1.5 (201602081156)
	    DL3  =>  RESOL DL3 Version 2.1.5 (201602080850)
	    KM1  =>  RESOL KM1 Version 2.1.5 (201602081152)

This start-up message contains important information on how to use the service. It:

- displays one or more URL templates under which the service is accessible (if permitted by firewall)
- displays tokens for all firmware images found in the public directory

To perform a firmware update using a service different from RESOL's official service you need to change the
"Firmware Update URL" in the device's configuration web interface. You can construct this URL by replacing the
"<token>" placeholder from one of the URLs with the correct token for your device.

To update a KM1 using the configuration given above I could use the following URL:

	http://192.168.2.100:3000/api/update/KM1



## Changelog

### Version 0.2.0 (2016-06-23)

- Extended to support more devices and newer versions


### Version 0.0.1 (2014-03-20)

- Initial version
- Allows to update a DL2 with firmware version 1.x to firmware version 2.1.0



## Legal Notices

RESOL, VBus, VBus.net and others are trademarks or registered trademarks
of RESOL - Elektronische Regelungen GmbH.

All other trademarks are the property of their respective owners.



## License

The MIT License (MIT)

Copyright (c) 2015-2016, Daniel Wippermann.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
