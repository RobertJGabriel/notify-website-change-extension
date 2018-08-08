


# Accepting payments with Node.js and Stripe and Herukou <span class="badge-patreon"><a href="https://www.patreon.com/robertjgabriel" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
> Handy guide to accept payments with stripe checkout.


## 🙌 Get set

### *Build the server*

1. Install the Heroku toolbelt from here https://toolbelt.heroku.com to launch, stop and monitor instances. Sign up for free at https://www.heroku.com if you don't have an account yet.

2. Install Node from here https://nodejs.org, this will be the server environment. Then open up Terminal or Command Line Prompt and make sure you've got the very most recent version of npm by installing it again:
  ```sudo npm install npm -g```

3. Create a new folder somewhere and let's create a new Node project. Hit Enter to accept the defaults.
  ```npm init```

4. Install the additional Node dependencies. Express is for the server, request is for sending out messages and body-parser is to process messages.

    ```node
      npm install stripe express pug body-parser --save
    ```

5. Create an index.js file in the folder and copy this into it. We will start by authenticating the bot.
```javascript

'use strict'

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;


const app = require('express')()
const stripe = require('stripe')(keySecret)

app.use(
  require('body-parser').urlencoded({
    extended: false
  })
)

// Default routing file
/**
 * @param  {} '/'
 * @param  {} (req
 * @param  {} res
 */
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(
    JSON.stringify({
      message: 'Nothing to see here!! 😘'
    })
  )
})

// Charge 1.00 dollars
/**
 * @param  {} '/donate'
 * @param  {} (req
 * @param  {} res
 */
app.post('/donate', (req, res) => {

  let amount = req.query.amount;
  if (typeof amount === 'undefined' || amount === null) {
    amount = 500; // 1 dollar as the default.
  }

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Donate' + amount,
        currency: 'usd',
        customer: customer.id
      })
    )
    .then(charge => res.redirect('https://robertgabriel.ninja/thankyou'))
})


/**
 * @param  {} 'port'
 * @param  {} process.env.PORT||5000
 */
app.set('port', process.env.PORT || 5000);

// Spin up the server
/**
 * @param  {} app.get('port'
 * @param  {} function(
 */
app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
});
    ```
6. Make a file called Procfile and copy this. This is so Heroku can know what file to run.
    ```web: node index.js```

7. Commit all the code with Git then create a new Heroku instance and push the code to the cloud.
      ```bash
        git init
        git add .
        git commit --message "hello world"
        heroku create
        git push heroku master
      ```

8. Get your Stipe Keys. To get you pecify values for the publishable and secret key environment variables from stripe. Click [here](https://dashboard.stripe.com/account/apikeys) .

9. On Heroku, its easy to create dynamic runtime variables (known as [config vars](https://devcenter.heroku.com/articles/config-vars)). This can be done in the Heroku dashboard UI for your app.

10. Pug example

  ```pug
    html
      body
        form(action="https://{{app-id}}.herokuapp.com/donate?amount={{amout to pay}}", method="post", id="stripe-donate")
          .form-group.label-placeholder
            label.control-label(for='amount') Amount to Donate in Dollars/Euros
            input.form-control(id="amount" type="number",placeholder="1 = 1 dollar/euro")
            span.help-block
              | Rememeber this is in dollars/euros
              code span.help-block.hint

          script(
            src="https://checkout.stripe.com/v2/checkout.js",
            data-name="Robert James Gabriel",
            data-image="./assets/img/me/me.webp"
            class="stripe-button",
            data-key='pk_live_4Uw6QOYu7lXV9N6XhFGYRjPf',
            data-locale="auto",
            data-description="Donate"
            )



  ```
