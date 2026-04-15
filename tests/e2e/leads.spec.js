const { test, expect } = require('../support')
const { faker } = require('@faker-js/faker')


test('should add lead to the waiting list', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await page.toast.containText(message)
});

test('should NOT add already added lead to the waiting list', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)
  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.containText(message)
});

test('should NOT add lead to the waiting list using invalid email', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Ewerton da Costa', 'www.globo.com')
  await page.landing.alertHasText('Email incorreto')
});

test('should NOT add lead to the waiting list when name is empty', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', 'edc@gmail.com')
  await page.landing.alertHasText('Campo obrigatório')
});

test('should NOT add lead to the waiting list when email is empty', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Ewerton da Costa', '')
  await page.landing.alertHasText('Campo obrigatório')
});

test('should NOT add lead to the waiting list when BOTH name and email are empty', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', '')
  await page.landing.alertHasText([
    'Campo obrigatório',
    'Campo obrigatório'
  ])
});