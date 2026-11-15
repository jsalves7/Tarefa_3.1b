# Animalec

Aplicação web (Vue 2 + Node/Express + MongoDB Atlas) sobre animais. Esta entrega (Tarefa 3.1 b) acrescenta ao back-office duas entidades novas, os **patrocinadores (sponsors)** e os **especialistas (experts)**, com wireframes, mockups e protótipo HTML5 semântico.

## Modelo de dados e cardinalidades

| Relação | Cardinalidade | Onde fica guardada |
|---|---|---|
| Sponsor — Animal | N:M | `sponsor.animals[]` (ObjectId de animais) |
| Expert — Animal | N:M | `expert.specialization.animals[]` |
| Expert — Grupo | N:M | `expert.specialization.groups[]` (enum: `anfibio`, `ave`, `mamifero`, `peixe`, `reptil`) |

- O modelo `Animal` **não foi alterado**.
- O grupo é um enum e não uma entidade. O Animalec só tem `group` (nível superior) e o documento `Animal` (nível da espécie), e a especialização do expert usa esses dois níveis. O resumo teórico fala em "espécie ou família", por isso `group` faz de família e o documento `Animal` de espécie.
- O servidor valida emails e URLs, ids de animais existentes, grupos dentro do enum e exige que o expert tenha pelo menos um grupo **ou** um animal.

## Onde está cada entregável

| Entregável | Localização |
|---|---|
| Wireframes (draw.io, 8 páginas por entidade: menu, listagem, formulário, detalhe × browser 1280 px / mobile 375 px) | `docs/wireframes/{sponsors,experts}.drawio` (PDF A4 em `docs/wireframes/wireframes.pdf`) |
| Mockups (mesmas 8 páginas, com cores e tipos de letra reais do Animalec) | `docs/mockups/{sponsors,experts}.drawio` (PDF A4 em `docs/mockups/mockups.pdf`) |
| Protótipo HTML5 semântico, integrado no Admin | `Front-end_Animalec/src/views/{sponsors,experts}/`, `src/components/{SponsorForm,ExpertForm,AnimalPicker,AnimalSponsors,AnimalExperts}.vue` |

Os PDF foram gerados a partir dos `.drawio` com o draw.io. Os wireframes são em tons de cinzento e anotam as regiões semânticas e as cardinalidades.

## Como correr

Back-end (precisa de `config/config.js` com a ligação ao MongoDB).

```
cd Back-end_Animalec && npm install && npm start
```

Front-end (em Node 20 é preciso a opção de OpenSSL legacy).

```
cd Front-end_Animalec && npm install
NODE_OPTIONS=--openssl-legacy-provider npm run serve   # desenvolvimento
NODE_OPTIONS=--openssl-legacy-provider npm run build   # produção
npx vue-cli-service lint --no-fix                       # lint sem corrigir ficheiros
```

## API nova

Todas as rotas exigem JWT (`checkAuth`), incluindo as da vista pública. Para `sponsors` e `experts` há:

| Método | Rota |
|---|---|
| GET | `/sponsors`, `/experts` |
| GET | `/sponsors/:id`, `/experts/:id` |
| POST | `/sponsors`, `/experts` |
| PUT | `/sponsors/:id`, `/experts/:id` |
| DELETE | `/sponsors/:id`, `/experts/:id` |
| PUT | `/sponsors/activate/:id`, `/sponsors/deactivate/:id` (idem em `/experts`) |

Rotas da vista pública da página de um animal. Exigem autenticação, mas devolvem só registos ativos e sem email.

- `GET /animals/:id/sponsors` — `name`, `type`, `logo`, `website`
- `GET /animals/:id/experts` — `name`, `title`, `institution`, `photo`, `website`

## Rotas do front-end

`/admin/sponsors`, `/admin/sponsors/add`, `/admin/sponsors/:sponsorId` e o equivalente (`:expertId`) para `/admin/experts`. A página de um animal mostra, por baixo do cartão, as secções "Patrocinadores" e "Especialistas".

## Decisões

- Os erros de validação de negócio, como animal inexistente ou expert sem especialização, respondem **406**, tal como os ids e emails inválidos já existentes.
- Lista pública vazia devolve 200 e a vista mostra "Sem … associados".
- `active` só muda por `activate`/`deactivate`; o `PUT` exige o payload completo validado e usa lista de campos permitidos.
- A semântica HTML5 usa `<main>` em `App.vue`, `section[aria-labelledby]`, `nav[aria-label]`, tabelas com `caption` e `th scope`, `fieldset` e `legend`, `label for`, inputs `email`, `url` e `date`, e ícones `aria-hidden`.
- `HeaderPage` ganhou a prop opcional `titleId`, usada no `aria-labelledby`. Sem ela o comportamento é o anterior.
- `SponsorForm` e `ExpertForm` partilham o formulário entre adicionar e editar.

## Limitações e problemas já existentes (não alterados)

- A página de um animal só mostra os especialistas ligados a esse animal; um especialista associado apenas a um grupo (ex.: "ave") não aparece nas páginas dos animais desse grupo.
- O back-end tem ativar/desativar, mas o back-office não tem essa ação. O estado só se vê no detalhe (VER).
- `/admin/animals/:animalId` está declarada antes de `/admin/animals/add`, pelo que `/add` não é alcançável.
- `Animal.vue` falha se `animal.links` estiver vazio.
- O login devolve o hash da password e `private_key`.
- `config/config.js` e o histórico do Git contêm credenciais; devem ser rodadas e movidas para variáveis de ambiente.
- `ListAnimals` usa `$fire({html})` sem escape.
