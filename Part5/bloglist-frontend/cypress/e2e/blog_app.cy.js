const testUser = {
  username: "username",
  password: "password",
  name: "testName",
};

const testUser2 = {
  username: "username2",
  password: "password2",
  name: "testName2",
};

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users/", testUser);
    cy.request("POST", "http://localhost:3003/api/users/", testUser2);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.contains("username");
    cy.contains("password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("username");
      cy.get("#password").type("password");
      cy.get("#login-button").click();

      cy.contains("testName is logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("username");
      cy.get("#password").type("wrongPassword");
      cy.get("#login-button").click();

      cy.get(".error").contains("wrong username or password");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("#username").type("username");
      cy.get("#password").type("password");
      cy.get("#login-button").click();

      cy.contains("testName is logged in");
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("Testing blog");
      cy.get("#author").type("Author");
      cy.get("#url").type("http://url.com");
      cy.get("#create-blog").click();

      cy.contains("Testing blog Author");
    });

    describe("Created blog exists", function () {
      beforeEach(function () {
        cy.contains("new blog").click();
        cy.get("#title").type("Testing blog");
        cy.get("#author").type("Author");
        cy.get("#url").type("http://url.com");
        cy.get("#create-blog").click();

        cy.contains("Testing blog Author");
      });

      it("Blog can be liked", function () {
        cy.contains("view").click();
        cy.contains("0").contains("like").click();

        cy.contains("1");
      });

      it("Blog can be deleted", function () {
        cy.contains("view").click();
        cy.get("#remove-blog").click();
        cy.contains("remove").should("not.exist");
      });

      it("Only blog owner sees delete button", function () {
        cy.contains("Testing blog Author");

        cy.contains("logout").click();
        cy.get("#username").type("username2");
        cy.get("#password").type("password2");
        cy.get("#login-button").click();

        cy.contains("testName2 is logged in");

        cy.contains("view").click();
        cy.contains("remove").should("not.exist");
      });

      it("Blogs are ordered based on likes", async function () {
        cy.contains("view").click();
        cy.contains("0").contains("like").click();
        cy.contains("1");

        cy.contains("new blog").click();
        cy.get("#title").type("Testing blog 2");
        cy.get("#author").type("Author 2");
        cy.get("#url").type("http://url.com");
        cy.get("#create-blog").click();

        cy.contains("Testing blog 2 Author 2");
        cy.contains("view").click();

        cy.contains("0")
          .parent()
          .find("#like-button")
          .click()
          .wait(500)
          .click()
          .wait(500)
          .click()
          .wait(500);

        cy.get(".blogContent").eq(0).should("contain", "Testing blog 2");
        cy.get(".blogContent").eq(1).should("contain", "Testing blog");
      });
    });
  });
});
