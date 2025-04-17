# Remove some Cookies

A little Akamai EdgeWorker script to remove some cookies before sending request to the origin.
This handler will be attached to the [onOriginRequest](https://techdocs.akamai.com/edgeworkers/docs/event-handler-functions#onoriginrequest) event.
![image](https://github.com/user-attachments/assets/106f5458-88fd-4f7e-b20a-105a10abcf65)


In this version, we removed the cookieList from the main code and used a separate file for it.

## Create .edgerc credentials

If you are new to Akamai EdgeWorkers, you must create [EdgeWorkers API credentials](https://techdocs.akamai.com/edgeworkers/reference/api-get-started) as we're going to use the EdgeWorkers API to get things going.
Also, install the [Akamai CLI](https://techdocs.akamai.com/developer/docs/about-clis) with the [EdgeWorkers plugin](https://techdocs.akamai.com/edgeworkers/docs/akamai-cli). The Akamai CLI will be used in the scripts section of our package.json.

## Clone repo and setup your environment

First clone the repo and setup the environment.

```
git clone https://github.com/jjgrinwis/ew-rm-cookies.git
cd ew-rm-cookies
npm install --save-dev typescript
npm install @types/akamai-edgeworkers
mkdir dist
mkdir built
```

Now we need to get the correct groupId and create a new EdgeWorker id. <br>
First lookup your _group_id_ that's the Akamai Group where your EdgeWorker script will be placed.<br>

```
akamai edgeworkers list-groups
```

_If you are not using the default section from .edgerc, make sure to add --section <section in .edgerc> to the `akamai edgeworkers list-groups` command to use the section in the .edgerc file that contains the credential set_

Just modify package.json and set your groupId in the _ew_group_id_ parameter of the config section. Also set the specific [resource tier](https://techdocs.akamai.com/edgeworkers/docs/resource-tier-limitations) you want to use and is part of your Akamai contract.

- 100:Basic Compute
- 200:Dynamic Compute
- 300:Enterprise Compute

_If you don't have EdgeWorkers enabled on your contract, just add it via the free [evaluation tier](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) in the Akamai marketplace._

When you have set your group_id and the correct resource tier, let's generate an edgeworker id:

```
npm run create-ew-id
```

This will create your unique EdgeWorker ID in your environment and selected group. Add the created EdgeWorker ID to the _ewid_ parameter which can be found in the config section of package.json.

## Activate this EdgeWorker

Feel free to make changes but after your are done, just run

```
npm run build
```

This will run some scripts and will upload your EdgeWorker package in your account and will activate it on Akamai staging platform by default.
When this is done, just update your CDN delivery configuration to start this EdgeWorker based on certain criteria like path or hostname.


### Debugging
If you need to do some EdgeWorker debugging, just generate an EdgeWorker debug token.
```
npm run generate-token
```
You can use that token in the Akamai-EW-Trace request header together with other [EdgeWorkers Pragma debug headers](https://techdocs.akamai.com/edgeworkers/docs/enable-enhanced-debug-headers) like *akamai-x-ew-debug-subs*
