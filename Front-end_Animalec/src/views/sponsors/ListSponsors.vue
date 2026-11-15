<template>
  <section class="page-section" aria-labelledby="titulo-sponsors">
    <b-container>
      <HeaderPage title="Gestão de Patrocinadores" titleId="titulo-sponsors" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <nav aria-label="Ações de patrocinadores">
            <router-link
              :to="{name:'addSponsor'}"
              tag="button"
              class="btn btn-outline-success mr-2 mt-2"
            >
              <i class="fas fa-plus-square" aria-hidden="true"></i> ADICIONAR PATROCINADOR
            </router-link>
            <router-link :to="{name:'admin'}" tag="button" class="btn btn-outline-info mr-2 mt-2">
              <i class="fas fa-bars" aria-hidden="true"></i> MENU PRINCIPAL
            </router-link>
          </nav>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--TABLE-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <table class="table table-striped">
            <caption class="sr-only">Lista de patrocinadores e animais patrocinados</caption>
            <thead class="thead-dark">
              <tr>
                <th scope="col">NOME</th>
                <th scope="col">TIPO</th>
                <th scope="col">ANIMAIS</th>
                <th scope="col">ESTADO</th>
                <th scope="col">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sponsor of sponsors" :key="sponsor._id">
                <td class="pt-4">{{sponsor.name}}</td>
                <td class="pt-4">{{sponsor.type}}</td>
                <td class="pt-4">{{animalNames(sponsor)}}</td>
                <td class="pt-4">{{sponsor.active ? "ATIVO" : "INATIVO"}}</td>
                <td>
                  <router-link
                    :to="{name:'editSponsor', params:{sponsorId: sponsor._id}}"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit" aria-hidden="true"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewSponsor(sponsor)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search" aria-hidden="true"></i> VER
                  </button>
                  <button
                    @click="removeSponsor(sponsor._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  >
                    <i class="fas fa-trash-alt" aria-hidden="true"></i> REMOVER
                  </button>
                </td>
              </tr>
              <tr v-if="sponsors.length === 0">
                <td colspan="5" class="text-center">Ainda não há patrocinadores.</td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--DETALHE-->
      <b-modal id="sponsor-detail" :title="selected ? selected.name : ''" ok-only ok-title="FECHAR">
        <dl v-if="selected">
          <dt>Tipo</dt>
          <dd>{{selected.type || "—"}}</dd>
          <dt>Email</dt>
          <dd>{{selected.email}}</dd>
          <dt>Website</dt>
          <dd>{{selected.website || "—"}}</dd>
          <dt>Patrocinador desde</dt>
          <dd>{{selected.since ? selected.since.substring(0, 10) : "—"}}</dd>
          <dt>Descrição</dt>
          <dd>{{selected.description || "—"}}</dd>
          <dt>Animais patrocinados</dt>
          <dd>{{animalNames(selected)}}</dd>
        </dl>
      </b-modal>
    </b-container>
  </section>
</template>

<script>
import { FETCH_SPONSORS, REMOVE_SPONSOR } from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";

export default {
  name: "ManageSponsors",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      sponsors: [],
      selected: null
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsors", "getMessage"])
  },
  methods: {
    fetchSponsors() {
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(
        () => {
          this.sponsors = this.getSponsors;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    animalNames(sponsor) {
      const names = sponsor.animals.map(animal => animal.name);
      return names.length ? `${names.length}: ${names.join(", ")}` : "0";
    },
    viewSponsor(sponsor) {
      this.selected = sponsor;
      this.$bvModal.show("sponsor-detail");
    },
    removeSponsor(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o patrocinador?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`sponsor/${REMOVE_SPONSOR}`, id).then(
            () => {
              this.$alert(this.getMessage, "Patrocinador removido!", "success");
              this.fetchSponsors();
            },
            err => {
              this.$alert(`${err.message}`, "Erro", "error");
            }
          );
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchSponsors();
  }
};
</script>
