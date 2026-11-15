<template>
  <section class="page-section" aria-labelledby="titulo-edit-expert">
    <b-container>
      <HeaderPage title="Editar Especialista" titleId="titulo-edit-expert" />
      <b-row>
        <b-col md="2" class="d-none d-md-block"></b-col>
        <b-col>
          <ExpertForm
            v-if="expert"
            :expert="expert"
            :animals="animals"
            :institutions="institutions"
            @submit="update"
          >
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-save" aria-hidden="true"></i> GUARDAR
            </button>
            <router-link
              :to="{name: 'listExperts'}"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            >
              <i class="fas fa-window-close" aria-hidden="true"></i> CANCELAR
            </router-link>
          </ExpertForm>
          <p v-else>A carregar...</p>
        </b-col>
        <b-col md="2" class="d-none d-md-block"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_EXPERTS, EDIT_EXPERT } from "@/store/experts/expert.constants";
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import ExpertForm from "@/components/ExpertForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "EditExpert",
  components: { HeaderPage, ExpertForm },
  data: () => {
    return { expert: null };
  },
  computed: {
    ...mapGetters("animal", ["getAnimals"]),
    ...mapGetters("expert", ["getExperts", "getExpertsById", "getMessage"]),
    animals() {
      return this.getAnimals;
    },
    institutions() {
      return [...new Set(this.getExperts.map(e => e.institution).filter(Boolean))];
    }
  },
  methods: {
    // Cópia de trabalho: a API devolve os animais populados, o formulário usa os ids
    load() {
      const stored = this.getExpertsById(this.$route.params.expertId);
      if (!stored) {
        this.$alert("Especialista não encontrado.", "Erro", "error");
        this.$router.push({ name: "listExperts" });
        return;
      }
      this.expert = {
        ...stored,
        title: stored.title || "",
        institution: stored.institution || "",
        website: stored.website || "",
        photo: stored.photo || "",
        bio: stored.bio || "",
        specialization: {
          groups: [...stored.specialization.groups],
          animals: stored.specialization.animals.map(animal => animal._id)
        }
      };
    },
    update() {
      this.$store.dispatch(`expert/${EDIT_EXPERT}`, this.expert).then(
        () => {
          this.$alert(this.getMessage, "Especialista atualizado!", "success");
          this.$router.push({ name: "listExperts" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    // Os dados são pedidos sempre, para sobreviver a um refresh da página
    Promise.all([
      this.$store.dispatch(`animal/${FETCH_ANIMALS}`),
      this.$store.dispatch(`expert/${FETCH_EXPERTS}`)
    ]).then(
      () => this.load(),
      err => {
        this.$alert(`${err.message}`, "Erro", "error");
      }
    );
  }
};
</script>
