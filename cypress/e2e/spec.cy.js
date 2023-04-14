const homePage = "https://www.sbzend.ssls.com";
const emailForLogin = 'ssls.automation+666@gmail.com';
const passwordForLogin = '123456';
const saveFieldsValue = [];
const profileFields = new Map([
  ["Name", 0],
  ["Email", 1],
  ["Password", 2],
  ["Phone", 3],
  ["Address", 4],
  ["Support pin", 5],
  ["Newsletter", 6]
]);

// run these tests as if in a desktop
// browser with a 720p monitor
beforeEach(() => {
  cy.visit(homePage)
    .viewport(1280, 720)
});

// Function verify that current url equal expected and title "Authorization" is displayed
function checkUrlAndTitle(cy) {
  cy.url().should('eq', homePage + "/")
    .get('[class="ssls-toolbar__btn-text"]').click()
    .get('[class="page-title"]').should('have.text', "Authorization")
  return cy;
}


// Test Case #1 - Authorization page(Welcome back!)
describe('Authorization page', () => {
  it('Welcome back!', () => {
    checkUrlAndTitle(cy)
    cy.get('[name="email"]').type(emailForLogin)
      .get('[name="password"]').type(passwordForLogin).get('[class="icon icon-eye"]').click()
      .get("input[name='password']").should("be.visible")
      .get('[class="btn-box"]').contains('Login').click()
      .get('button').contains(emailForLogin).click().should("be.visible")
      .get('[class="container"]').should('not.have.text', 'Log in')
  })
})


// Test Case #2 - Authorization page(Not registered user)
describe('Authorization page', () => {
  it('Not registered user', () => {
    checkUrlAndTitle(cy)
    cy.get('[name="email"]').type("fedstg@gmail.com")
      .get('[name="password"]').type("sdgg").get('[class="icon icon-eye"]').click()
      .get("input[name='password']").should("be.visible")
      .get('[class="btn-box"]').contains('Login').click()
      .get('[class="noty_text"]').contains('Uh oh! Email or password is incorrect').should("be.visible")
  })
})


// Test Case #3 - Authorization page(Invalid email)
describe('Authorization page', () => {
  it('Invalid email', () => {
    checkUrlAndTitle(cy)
    cy.get('[name="email"]').type("fe47etggmail.com")
      .get('[name="password"]').type(passwordForLogin).get('[class="icon icon-eye"]').click()
      .get("input[name='password']").should("be.visible")
      .get('[class="btn-box"]').contains('Login').click()
      .get('[class="left-tooltip-box"]').contains(" Uh oh! Thisisn’t an email").should("be.visible")
  })
})


// Test Case #4 - My profile page(Client area)
describe('My profile page', () => {
  it('Client area', () => {
    // Pre-Condition
    cy.get('[class="ssls-toolbar__btn-text"]').click()
    logInAndProceedToUserProfilePage();
    saveValuesWithoutChanges();
    cy.get('[class="icon icon-arrows-cw"]').click()
      .get('[class="description"]').last().find('[class="toggle-btn on"]').click()
      .get('[class="description"]').last().find('[class="toggle-btn"]').click();
    dataFieldsAfterSaving();
    cy.get('button').contains(emailForLogin).click()
      .get('button').contains('Log out').click();
    //Step
    logInAndProceedToUserProfilePage();
    compareCurrentDataWithPrecondition();
  })
})

// Function to save values(without changes saved values)
function saveValuesWithoutChanges() {
  const profileFields = new Map([
    ["Name", 0],
    ["Email", 1],
    ["Phone", 3],
    ["Address", 4]
  ]);

  profileFields.forEach((value, key) => {
    cy.get('[class="terms"]').contains(key).get('[class="icon icon-pencil"]').eq(value).click()
      .get('[class="edit-box"]').contains("Cancel").click()
  });
}

function dataFieldsAfterSaving() {
  profileFields.forEach((value, key) => {

    if (key == "Newsletter") {
      cy.get('[class="description"]').last().find('[class="toggle-btn on"]').then(($option) => {
        saveFieldsValue.push($option.selector);
      })
    } else {
      cy.get('[class="terms"]').contains(key).get('[class="text ng-binding"]').eq(value).then(($btn) => {
        saveFieldsValue.push($btn.text());
      })
    }
  });
}

// Function for log in user and open Profile page
function logInAndProceedToUserProfilePage() {
  cy.get('[name="email"]').type(emailForLogin)
    .get('[name="password"]').type(passwordForLogin)
    .get('[class="btn-box"]').contains('Login').click()
    .get('button').contains(emailForLogin).click()
    .get('[class="ssls-dropdown__holder ssls-dropdown__holder--toolbar"]').contains(" Profile").click();
}


function compareCurrentDataWithPrecondition() {
  profileFields.forEach((value, key) => {
    if (key == "Newsletter") {
      cy.get('[class="description"]').last().find('[class="toggle-btn on"]').should('have.class', 'toggle-btn on')
    } else {
      cy.get('[class="terms"]').contains(key).get('[class="text ng-binding"]').eq(value).then(($div) => {
        expect($div).to.have.text(saveFieldsValue[value])
      })
    }
  });
}
