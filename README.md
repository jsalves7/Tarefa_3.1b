# Animalec

Aplicação web (Vue 2, Node/Express e MongoDB Atlas) sobre animais. Esta entrega (Tarefa 3.1 b) acrescenta ao back-office duas entidades novas, os **patrocinadores (sponsors)** e os **especialistas (experts)**, com wireframes, mockups e protótipo HTML5 semântico.

## Modelo de dados e cardinalidades

| Relação | Cardinalidade | Onde fica guardada |
|---|---|---|
| Sponsor — Animal | N:M | `sponsor.animals[]` (ObjectId de animais) |
| Expert — Animal | N:M | `expert.specialization.animals[]` |
| Expert — Grupo | N:M | `expert.specialization.groups[]` (enum: `anfibio`, `ave`, `mamifero`, `peixe`, `reptil`) |

- O modelo `Animal` **não foi alterado**.
- O grupo é um enum e não uma entidade. O Animalec só tem `group` (nível superior) e o documento `Animal` (nível da espécie), e a especialização do expert usa esses dois níveis. Como o resumo teórico fala em "espécie ou família", `group` faz de família e o documento `Animal` de espécie.
- O servidor valida emails e URLs, ids de animais existentes, grupos dentro do enum e exige que o expert tenha pelo menos um grupo **ou** um animal.

## Onde está cada entregável

| Entregável | Localização |
|---|---|
| Wireframes (draw.io, 8 páginas por entidade: menu, listagem, formulário, detalhe × browser 1280 px / mobile 375 px) | `docs/wireframes/{sponsors,experts}.drawio` (PDF A4 em `docs/wireframes/wireframes.pdf`) |
| Mockups (mesmas 8 páginas, com cores e tipos de letra reais do Animalec) | `docs/mockups/{sponsors,experts}.drawio` (PDF A4 em `docs/mockups/mockups.pdf`) |
| Protótipo HTML5 estático por entidade, ligado a partir do Admin (abrem num novo separador) | `Front-end_Animalec/public/prototipos/{sponsors,experts}.html` (em `/prototipos/sponsors.html` e `/prototipos/experts.html`) |
| Protótipo HTML5 semântico funcional, integrado no Admin | `Front-end_Animalec/src/views/{sponsors,experts}/`, `src/components/{SponsorForm,ExpertForm,AnimalPicker,AnimalSponsors,AnimalExperts}.vue` |

Os PDF foram gerados a partir dos `.drawio` com o draw.io e os wireframes são em tons de cinzento.

## Como correr

Back-end, que precisa de `config/config.js` com a ligação ao MongoDB.

```
cd Back-end_Animalec && npm install && npm start
```

Front-end, que em Node 20 precisa da opção de OpenSSL legacy.

```
cd Front-end_Animalec && npm install
NODE_OPTIONS=--openssl-legacy-provider npm run serve   # desenvolvimento
NODE_OPTIONS=--openssl-legacy-provider npm run build   # produção
npx vue-cli-service lint --no-fix                       # lint sem corrigir ficheiros
```

## API nova

Todas as rotas exigem JWT (`checkAuth`), incluindo as da vista pública. Para `sponsors` e `experts` existem as rotas seguintes.

| Método | Rota |
|---|---|
| GET | `/sponsors`, `/experts` |
| GET | `/sponsors/:id`, `/experts/:id` |
| POST | `/sponsors`, `/experts` |
| PUT | `/sponsors/:id`, `/experts/:id` |
| DELETE | `/sponsors/:id`, `/experts/:id` |
| PUT | `/sponsors/activate/:id`, `/sponsors/deactivate/:id` (idem em `/experts`) |

As rotas da vista pública da página de um animal exigem autenticação, mas devolvem só registos ativos e sem email.

- `GET /animals/:id/sponsors` devolve `name`, `type`, `logo` e `website`
- `GET /animals/:id/experts` devolve `name`, `title`, `institution`, `photo` e `website`

## Rotas do front-end

`/admin/sponsors`, `/admin/sponsors/add`, `/admin/sponsors/:sponsorId` e o equivalente (`:expertId`) para `/admin/experts`. A página de um animal mostra, por baixo do cartão, as secções "Patrocinadores" e "Especialistas".

## Protótipos HTML5 estáticos

Cada entidade tem um protótipo em HTML5 semântico, com listagem, formulário e detalhe de exemplo. São ficheiros estáticos, sem JavaScript nem ligação à API, e usam o `animalec.css` da aplicação.

- Ficheiros: `Front-end_Animalec/public/prototipos/sponsors.html` e `Front-end_Animalec/public/prototipos/experts.html`
- Para ver o protótipo não é preciso correr o front-end nem o back-end: basta abrir o ficheiro HTML no browser (duplo clique ou `open Front-end_Animalec/public/prototipos/sponsors.html`). Os tipos de letra e os ícones vêm de CDN, por isso é preciso ligação à Internet
- Com o front-end a correr, também abrem em `http://localhost:8081/prototipos/sponsors.html` e `http://localhost:8081/prototipos/experts.html`
- Na aplicação, em **ADMIN** (`/admin`), estão os botões "Protótipo de patrocinadores" e "Protótipo de especialistas", por baixo dos cartões, que os abrem num novo separador

As vistas Vue em `src/views/{sponsors,experts}/` são a versão funcional das mesmas páginas, ligada à API.

## Decisões

- Os erros de validação de negócio, como animal inexistente ou expert sem especialização, respondem **406**, tal como os ids e emails inválidos já existentes.
- Uma lista pública vazia devolve 200 e a vista mostra "Sem … associados".
- `active` só muda por `activate` ou `deactivate` e o `PUT` exige o payload completo validado, com lista de campos permitidos.
- A semântica HTML5 usa `<main>` em `App.vue`, `section[aria-labelledby]`, `nav[aria-label]`, tabelas com `caption` e `th scope`, `fieldset` e `legend`, `label for`, inputs `email`, `url` e `date`, e ícones `aria-hidden`.
- `HeaderPage` ganhou a prop opcional `titleId`, usada no `aria-labelledby`. Sem ela o comportamento é o anterior.
- `SponsorForm` e `ExpertForm` partilham o formulário entre adicionar e editar.

## Limitações e problemas já existentes (não alterados)

- A página de um animal só mostra os especialistas ligados a esse animal, por isso um especialista associado apenas a um grupo, como "ave", não aparece nas páginas dos animais desse grupo.
- O back-end tem ativar e desativar, mas o back-office não tem essa ação e o estado só se vê no detalhe (VER).
- `/admin/animals/:animalId` está declarada antes de `/admin/animals/add`, por isso `/add` não é alcançável.
- `Animal.vue` falha se `animal.links` estiver vazio.
- O login devolve o hash da password e `private_key`.
- `config/config.js` e o histórico do Git contêm credenciais, que devem ser rodadas e movidas para variáveis de ambiente.
- `ListAnimals` usa `$fire({html})` sem escape.
