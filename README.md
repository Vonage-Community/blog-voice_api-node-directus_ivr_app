# "Talking to Your Database" Demo

This repository shows the sample code for our blog "Talking to Your Database," which shows how to use Directus as a data store for an IVR application.

## Basic Configuration

### Requirements

* [Directus Account](https://directus.cloud/register)
* [Vonage Developer Account](https://developer.vonage.com/sign-up)
* Node.js 18+

You will also need a tunneling system like [ngrok](https://ngrok.io) if you want to run the code locally.

### Set up a Vonage Account

1. Sign up for a free account at [https://developer.vonage.com/sign-up](https://developer.vonage.com/sign-up)
1. Under "Build & Manage", select "Applications"
1. Click "Create a new application"
1. Give the application a name
1. Click "Generate public and private key" to download a new private key for this application
1. Enable the Voice API Capabilities
1. Enter the URL for your application into the Answer URL, or the ngrok URL if you are using ngrok
1. Click "Generate new application" at the bottom
1. Under the "Link Numbers" section, click the "Link" button to attach your Vonage Number to this application

### Set up Directus

1. Go to <https://docs.directus.io/getting-started/quickstart.html> and follow the quick start guide to either set up a Directus Cloud account, or set up Directus to run locally.

### Set up Configuration File

1. Copy `.env.dist` to `.env`
1. Fill in the variables with the needed information:
    * DIRECTUS_INSTANCE - The URL for your Directus install
    * DIRECTUS_TOKEN - The token for the user you create as part of the demo
    * API_APPLICATION_ID - The Vonage Application ID we created above
    * PRIVATE_KEY - [A base64 version of the Vonage Private Key we saved earlier](https://developer.vonage.com/en/blog/using-private-keys-in-environment-variables)

## Running the Application

To run the application, open up a terminal and run:

    node server.js

## Development and Contributing

Interested in contributing? We :heart: pull requests! See the [Contribution](CONTRIBUTING.md) guidelines.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know! You can either:

- Open an issue on this repository
- Tweet at us! We're [@VonageDev on X](https://x.com/VonageDev)
- Or [join the Vonage Developer Community Slack](https://developer.nexmo.com/community/slack)