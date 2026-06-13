require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || '2-231093062';
const PORT = process.env.PORT || 3000;
const CUSTOM_OBJECT_URL = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
const CUSTOM_OBJECT_PROPERTIES = ['name', 'category', 'price'];

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

app.get('/', async (req, res) => {
    try {
        const resp = await axios.get(CUSTOM_OBJECT_URL, {
            headers,
            timeout: 10000,
            params: {
                properties: CUSTOM_OBJECT_PROPERTIES.join(',')
            }
        });
        const data = resp.data.results;
        res.render('homepage', {
            title: 'Custom Objects | Integrating With HubSpot I Practicum',
            data
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.render('homepage', {
            title: 'Custom Objects | Integrating With HubSpot I Practicum',
            data: [],
            error: 'Unable to load custom object records.'
        });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price
        }
    };

    try {
        await axios.post(CUSTOM_OBJECT_URL, newRecord, { headers, timeout: 10000 });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.render('updates', {
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
            error: 'Unable to create the custom object record.',
            formData: req.body
        });
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
if (require.main === module) {
    app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

module.exports = app;
