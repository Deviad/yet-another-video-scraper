
# README

## The driving factor

The driving factor that pushed me to create this project is to show how easy it is to create such a thing, given nowadays resources, and push other people to create new projects with node.
Puppeteer is a very good alternative to other tools like Beautiful Soup and JSoup, which does its job very well.


## Installation
```
yarn install
yarn postinstall
```

## Simple use case

So far the only available options through the CLI are username, password and url.


```yarn start:tsnode --username <yourusername> --password <yourpassword> --url (http|https)://therestoftheurl```

You can choose to run the application with the transpiled files located inside dist.

```yarn start --username <yourusername> --password <yourpassword> --url (http|https)://therestoftheurl```


In the future I will add the possibility to choose via the CLI the time to wait between one download and the other and also to choose the download quality.


## Availability

At the moment the only available portal is Udemy.

## Known issues

At the moment when you go on Udemy you might need to complete the captcha and then you will be able to restart the app and get in without the captcha for a few times.
I plan to investigate the countermeasures to take in order to avoid this.





